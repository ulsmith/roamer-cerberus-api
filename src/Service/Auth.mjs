import JWT from 'jsonwebtoken';
import Service from '../../node_modules/cerberus-mvc/Base/Service.js';
import RestError from '../../cerberus-mvc/Error/Rest.js';
import Crypto from '../../cerberus-mvc/Library/Crypto.js';

import UserModel from '../Model/Identity/User.js';
import UserAccountModel from '../Model/Identity/UserAccount.js';

/**
 * @namespace API/Service
 * @class Auth
 * @extends Service
 * @description Service class providing authentication functionality, accessable thorughout the application
 * @author Paul Smith <p@ulsmith.net>
 * @copyright 2021 (ulsmith.net) all rights reserved
 * @license MIT
 */
export default class Auth extends Service {

	/**
	 * @public @method constructor
	 * @description Base method when instantiating class
	 */
	constructor() {
		super();

		this.service = 'auth';
		this.user;
		this.department;
		this.organisation;
		this.corporation;
		this.permissions;
		this.cache;
	}

	/**
	 * @public @method login
	 * @description Log a user in based on identity and password
	 * @param {String} identity The resource to fetch with the given key
	 * @param {String} password The resource to fetch with the given key
	 * @param {String} ip The resource to fetch with the given key
	 * @return Promise a resulting promise with an error to feed back or data to send on
	 */
	login(identity, identityType, password, organisationID, userAgent, ip) {
		if (!identity || !password) throw new RestError('Login details incorrect, please try again.', 401);
		if (!!identityType && ['email', 'phone'].indexOf(identityType) < 0) throw new RestError('Login details incorrect, please try again.', 401);

		let userModel = new UserModel();
		let userAccountModel = new UserAccountModel();

		return userModel.getAuthedFromIdentity(identity, identityType)
			.then((user) => {
				// NOTE: need to flood prevent here too
				if (!user) throw new RestError('Login details incorrect, please try again.', 401);
				if (user.password !== Crypto.passwordHash(password, user.password.substring(0, user.password.length / 2))) throw new RestError('Login details incorrect, please try again.', 401);
				if (!user.active) throw new RestError('User is not active, please try again later.', 401);

				return user;
			})
			.then((user) => userModel.getUserOrganisations(user.id).then((orgs) => ({ user, orgs })))
			.then((userOrgs) => {
				let org = userOrgs.orgs[0];

				// we have more than one org, so user must remake request with org id, give them choice
				if (userOrgs.orgs.length > 1) {
					let orgs = userOrgs.orgs.filter((data) => data.id === organisationID);

					if (org.length !== 1) {
						throw new RestError({
							'message': 'User is part of many organisations, please add [organisationID] to request.',
							'organisations': userOrgs.orgs
						}, 403);
					}

					org = orgs[0];
				}

				// if we do have an org chosen, check active too
				if (!!org && !org.active) throw new RestError('Organisation is not active, please try again later.', 401);

				// update user, get permissions for UI and return token, only one org so must be that one
				let date = new Date();
				return userAccountModel
					.update(userOrgs.user.user_account_id, { login_current: date, login_previous: userOrgs.user.login_current, user_agent: userAgent, ip_address: ip })
					.then(() => userModel.getPermisions('ui.', userOrgs.user.id, org ? org.id : undefined))
					.then((perms) => {
						// splice in identity
						userOrgs.user.identity = identity;
						userOrgs.user.identityType = identityType;

						let result = {
							token: this._generateJWT(userOrgs.user, org, userAgent),
							user: {
								id: userOrgs.user.id,
								name: userOrgs.user.name,
								type: userOrgs.user.type,
								identity: identity,
								identityType: identityType,
								loginCurrent: date,
								loginPrevious: userOrgs.user.login_current
							},
							permissions: perms
						};

						result.organisation = {
							id: org.id,
							name: org.name,
							nameUnique: org.name_unique,
							description: org.description
						};

						result.department = {
							id: org.department_id,
							name: org.department_name,
							nameUnique: org.department_name_unique,
							description: org.department_description
						};

						result.corporation = {
							id: org.corporation_id,
							name: org.corporation_name,
							nameUnique: org.corporation_name_unique,
							description: org.corporation_description
						};

						this.user = result.user;
						this.department = result.department;
						this.organisation = result.organisation;
						this.corporation = result.corporation;
						this.permissions = result.permissions;

						return result;
					});
			});
	}

	/**
	 * @public @method verify
	 * @description Verify a user is still logged in. Has JWT expired?
	 * @param {String} authorization The auth string from the request header, to verify
	 * @return {Object} The user object to return if verified
	 */
	verify(authorization, userAgent) {
		let payload;
		let jwt = authorization.replace('Bearer', '').trim();

		try {
			payload = this._verifyJWT(jwt);
		} catch (error) {
			if (error.name === 'TokenExpiredError') {
				throw new RestError({
					status: 'expired',
					message: 'Authorization expired, please refresh expired token.',
					method: 'POST',
					url: 'account/refresh',
					body: { token: jwt }
				}, 401);
			}

			throw new RestError({
				status: 'expired',
				message: 'Authorization failed, please log in to authorize.',
				method: 'POST',
				url: 'account/authenticate',
				body: { identity: '', password: '' }
			}, 401);
		}

		// have we switched origins?
		if (payload.aud !== this.$client.origin) throw new RestError('Origin / Token missmatch, invalid', 401);
		if (payload.userAgent !== userAgent) throw new RestError('Client browser has changed, invalid', 401);

		let userModel = new UserModel();

		return userModel.getAuthed(payload.userID)
			.then((user) => {
				if (user) return user;
				throw new RestError('User not found, please try again.', 404);
			})
			.then((user) => userModel.getUserOrganisation(user.id, payload.organisationID).then((org) => ({ user, org })))
			.then((userOrg) => userModel.getAllPermisions(userOrg.user.id, userOrg.org.id).then((perms) => ({
				user: userOrg.user,
				org: userOrg.org,
				perms: perms
			})))
			.then((userOrgPerms) => {
				if (!userOrgPerms.user) throw new RestError('User not found, please try again.', 404);
				if (!userOrgPerms.org) throw new RestError('Organisation not found, please try again later.', 404);
				if (!userOrgPerms.user.active) throw new RestError('User is not active, please try again later.', 401);

				// cache user for system use
				this.user = userOrgPerms.user;
				this.user.identity = payload.userIdentity;
				this.user.identityType = payload.userIdentityType;

				this.department = {
					id: userOrgPerms.org.department_id,
					name: userOrgPerms.org.department_name,
					name_unique: userOrgPerms.org.department_name_unique,
					description: userOrgPerms.org.department_description,
					active: userOrgPerms.org.department_active
				};

				this.organisation = {
					id: userOrgPerms.org.id,
					name: userOrgPerms.org.name,
					name_unique: userOrgPerms.org.name_unique,
					description: userOrgPerms.org.description,
					active: userOrgPerms.org.active
				};

				this.corporation = {
					id: userOrgPerms.org.corporation_id,
					name: userOrgPerms.org.corporation_name,
					name_unique: userOrgPerms.org.corporation_name_unique,
					description: userOrgPerms.org.corporation_description,
					active: userOrgPerms.org.corporation_active
				};

				this.permissions = userOrgPerms.perms;
				this.cache = {};

				// return basic user details when hit directly
				return {
					user: {
						id: this.user.id,
						name: this.user.name,
						type: this.user.type,
						identity: payload.userIdentity,
						identityType: payload.userIdentityType,
						loginCurrent: this.user.login_current,
						loginPrevious: this.user.login_previous
					},
					department: {
						id: this.department.id,
						name: this.department.name,
						nameUnique: this.department.name_unique,
						description: this.department.description
					},
					organisation: {
						id: this.organisation.id,
						name: this.organisation.name,
						nameUnique: this.organisation.name_unique,
						description: this.organisation.description
					},
					corporation: {
						id: this.corporation.id,
						name: this.corporation.name,
						nameUnique: this.corporation.name_unique,
						description: this.corporation.description
					},
					permissions: this.permissions.filter((perm) => perm.role.indexOf('ui.') === 0)
				};
			});
	}

	/**
	 * @public @method refresh
	 * @description Verify a token is valid or expired, then refresh?
	 * @param {String} authorization The auth string from the request header, to verify
	 * @return {Object} The user object to return if verified
	 */
	refresh(authorization) {
		let jwt = authorization.replace('Bearer', '').trim();

		try {
			// if verified, just refresh anyway
			if (this._verifyJWT(jwt)) return this._refreshJWT(jwt);
		} catch (error) {
			// if expired, refresh
			if (error.name === 'TokenExpiredError') return this._refreshJWT(jwt);

			throw new RestError({
				message: 'Authorization failed, please log in to authorize.',
				method: 'POST',
				url: this.$environment.API_ADDRESS + '/account/authenticate',
				body: { identity: '', identityType: '', password: '' }
			}, 401);
		}
	}

	/**
	 * @public @method isPermitted
	 * @description Handle a permission denied situation
	 * @param {String} role The specific role to check as 'api.app.aaa.bbb' or any of a combination of roles allowed 'api.app.aaa/aaaa.bbb/bbbb'
	 * @param {String} type The access type to check such as 'read' or more than one 'read,write,delete'
	 */
	isPermitted(role, type) {
		// convert to regex, get roles and split types
		let regex = '^' + role.split('.').map((r) => r.indexOf('/') > 0 ? '(' + r.replace(/\//g, '|') + ')' : r).join('\\.') + '$';
		let roles = this.filterPermissions(new RegExp(regex));
		let types = type.split(',');

		// no roles found
		if (roles.length === 0) this.permissionDenied(role, type);

		// one role found
		if (roles.length === 1) {
			if (
				(types.length === 1 && !roles[0][types[0].trim()])
				|| (types.length === 2 && (!roles[0][types[0].trim()] || !roles[0][types[1].trim()]))
				|| (types.length === 3 && (!roles[0][types[0].trim()] || !roles[0][types[1].trim()] || !roles[0][types[2].trim()]))
			) this.permissionDenied(role, types[0]);
		}

		// more than one role found
		if (roles.length > 1) {
			let reduced = roles.reduce((acc, cur) => ({ read: acc.read || cur.read, write: acc.write || cur.write, delete: acc.delete || cur.delete }));
			if (
				(types.length === 1 && !reduced[types[0].trim()])
				|| (types.length === 2 && (!reduced[types[0].trim()] || !reduced[types[1].trim()]))
				|| (types.length === 3 && (!reduced[types[0].trim()] || !reduced[types[1].trim()] || !reduced[types[2].trim()]))
			) this.permissionDenied(role, types[0]);
		}
	}

	/**
	 * @public @method permissionDenied
	 * @description Handle a permission denied situation
	 * @param {String} role The role to check
	 * @param {String} type The access type to check
	 */
	permissionDenied(role, type) {
		console.log(`[UserID: ${this.user.id}, OrgID: ${this.organisation.id}] No '${type}' access to '${role}' role`);
		throw new RestError(`Permission denied, you do not have '${type}' access to this resource`, 403);
	}

	/**
	 * @public @method getPermission
	 * @description Fetch permission to check
	 * @param {String} role The role to check
	 * @return {Object} Do you have permission, permission object
	 */
	getPermission(role) { return this.$services.auth.permissions.find((perm) => perm.role === role) || {} }

	/**
	 * @public @method getPermissions
	 * @description Fetch permissions to check
	 * @param {String} prefix The partial role prefix to match from the beginning of a role
	 * @return {Array} Do you have permissions, array of permission objects
	 */
	getPermissions(prefix) { return this.$services.auth.permissions.filter((perm) => perm.role.indexOf(prefix) === 0) || [] }

	/**
	 * @public @method filterPermissions
	 * @description Fetch permissions to check
	 * @param {Regex} regex The regex to filter on
	 * @return {Array} Do you have permissions, array of permission objects
	 */
	filterPermissions(regex) { return this.$services.auth.permissions.filter((perm) => regex.test(perm.role)) || [] }

	/**
	 * @private @method _generateJWT
	 * @description Creates a JWT from a user object
	 * @param {Object} user The user object to use for the JWT
	 * @return {String} JWT token
	 */
	_generateJWT(user, organisation, userAgent) {
		return JWT.sign({
			iss: this.$environment.API_ADDRESS,
			aud: this.$client.origin,
			iat: Math.floor(Date.now() / 1000),
			nbf: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + parseInt(this.$environment.JWT_EXPIRE_SECONDS),
			userID: user.id,
			userIdentity: user.identity,
			userIdentityType: user.identityType,
			organisationID: organisation ? organisation.id : undefined,
			departmentID: organisation ? organisation.department_id : undefined,
			userAgent: userAgent
		}, process.env.JWT_KEY, { algorithm: 'HS256' });
	}

	/**
	 * @private @method _verifyJWT
	 * @description Verify JWT is valid
	 * @param {String} token The token to verify
	 * @return {Boolean} Is JWT verified or not?
	 */
	_verifyJWT(token) {
		return JWT.verify(token, process.env.JWT_KEY, { algorithm: 'HS256' });
	}

	/**
	 * @private @method _refreshJWT
	 * @description Verify JWT is valid
	 * @param {String} token The token to verify
	 * @return {Boolean} Is JWT verified or not?
	 */
	_refreshJWT(token) {
		let decoded = JWT.decode(token, { complete: true });
		decoded.payload.exp = Math.floor(Date.now() / 1000) + parseInt(this.$environment.JWT_EXPIRE_SECONDS);
		return JWT.sign(decoded.payload, process.env.JWT_KEY, { algorithm: 'HS256' });
	}
}
