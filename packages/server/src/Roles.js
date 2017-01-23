// @flow
import { isEmpty } from 'lodash';
import type { DBInterface, UserResolver } from 'roles-common';

export const DEFAULT_GROUP = 'DEFAULT_GROUP';

const Roles = {
  init(db: DBInterface, userResolver: UserResolver) {
    if (!db) {
      throw new Error('A database driver is required');
    }
    this.db = db;
    if (!userResolver) {
      throw new Error('A user resolver is required');
    }
    this.userResolver = userResolver;
  },
  async addUserToRoles(
    userId: string | [string],
    roles: string | [string],
    group: string = DEFAULT_GROUP,
  ): Promise<void> {
    if (isEmpty(userId)) {
      throw new Error('userId is required');
    }
    if (isEmpty(roles)) {
      throw new Error('roles are required');
    }
    if (isEmpty(group)) {
      throw new Error('group is required');
    }
    // eslint-disable-next-line no-param-reassign
    userId = Array.isArray(userId) ? userId : [userId];
    // eslint-disable-next-line no-param-reassign
    roles = Array.isArray(roles) ? roles : [roles];

    userId.forEach(async (id: string) => {
      const foundUser = await this.userResolver.findUserById(id);
      if (foundUser) {
        await this.db.addUserToRoles(id, roles, group);
      } else {
        throw new Error(`userId ${id} not found`);
      }
    });
  },
  async createRole(role: string, group: string = DEFAULT_GROUP): Promise<string> {
    if (isEmpty(role)) {
      throw new Error('role is required');
    }
    if (await this.db.roleExists(role, group)) {
      throw new Error('role already exists');
    }
    const roleId = await this.db.addRole(role);
    return roleId;
  },
  deleteRole(role: string, group: string = DEFAULT_GROUP): Promise<void> {
    return this.db.deleteRole(role, group);
  },
  getAllRoles(): Promise<Object> {
    return this.db.getAllRoles();
  },
  async getGroupsForUser(userId: string): Promise<Object> {
    const foundUser = await this.userResolver.findUserById(userId);
    if (foundUser) {
      return await this.db.getGroupsForUser(userId);
    }
    throw new Error(`userId ${userId} not found`);
  },
  async getRolesForUser(userId: string): Promise<Object> {
    const foundUser = await this.userResolver.findUserById(userId);
    if (foundUser) {
      return await this.db.getRolesForUser(userId);
    }
    throw new Error(`userId ${userId} not found`);
  },
  getUsersInRole(role: string, group: string = DEFAULT_GROUP): Promise<[string]> {
    return this.db.getUsersInRole(role, group);
  },
  getUsersInGroup(group: string = DEFAULT_GROUP): Promise<[string]> {
    return this.db.getUsersInGroup(group);
  },
  removeUserFromRoles(userId: string | [string], roles: string, group: string = DEFAULT_GROUP) {
    if (isEmpty(userId)) {
      throw new Error('userId is required');
    }
    if (isEmpty(roles)) {
      throw new Error('roles are required');
    }
    if (isEmpty(group)) {
      throw new Error('group is required');
    }
    // eslint-disable-next-line no-param-reassign
    userId = Array.isArray(userId) ? userId : [userId];
    // eslint-disable-next-line no-param-reassign
    roles = Array.isArray(roles) ? roles : [roles];

    userId.forEach(async (id: string) => {
      const foundUser = await this.userResolver.findUserById(id);
      if (foundUser) {
        await this.db.addUserToRoles(id, roles, group);
      } else {
        throw new Error(`userId ${id} not found`);
      }
    });
  },
  async setUserRoles(userId: string, roles: Object): Promise<void> {
    const foundUser = await this.userResolver.findUserById(userId);
    if (foundUser) {
      return await this.db.setUserRoles(userId);
    }
    throw new Error(`userId ${userId} not found`);
  },
  userIsInRole(userId: string, role: string, group: string = DEFAULT_GROUP): Promise<boolean> {
    return this.db.userIsInRole(userId, role, group);
  },
  userIsInGroup(userId: string): Promise<boolean> {
    return this.db.userIsInGroup(userId);
  },
};

export default Roles;
