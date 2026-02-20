/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import {
  ActionBuilder,
  MutationBuilder,
  QueryBuilder,
  DatabaseReader,
  DatabaseWriter,
} from "convex/server";
import { DataModel } from "./dataModel.js";

/**
 * Define a query in this Convex app's public API.
 *
 * This function will be allowed to read your Convex database and will be accessible from the client.
 *
 * @param func - The query function. It receives a `QueryCtx` as its first argument.
 * @returns The wrapped query. Include this as an `export` to add it to your app's API.
 */
export declare const query: QueryBuilder<DataModel, "public">;

/**
 * Define a mutation in this Convex app's public API.
 *
 * This function will be allowed to modify your Convex database and will be accessible from the client.
 *
 * @param func - The mutation function. It receives a `MutationCtx` as its first argument.
 * @returns The wrapped mutation. Include this as an `export` to add it to your app's API.
 */
export declare const mutation: MutationBuilder<DataModel, "public">;

/**
 * Define an action in this Convex app's public API.
 *
 * An action is a function which can execute any JavaScript code, including non-deterministic
 * code and code with side-effects, like calling third-party services.
 * They can be run in Convex's JavaScript environment or in Node.js using the "use node" directive.
 * They can interact with the database indirectly by calling queries and mutations using the provided `ctx.runQuery` and `ctx.runMutation` functions.
 *
 * @param func - The action function. It receives an `ActionCtx` as its first argument.
 * @returns The wrapped action. Include this as an `export` to add it to your app's API.
 */
export declare const action: ActionBuilder<DataModel, "public">;

/**
 * A set of services for use within Convex query and mutation functions.
 *
 * Note: The `db` property is used to read from and write to the database. The
 * `auth` property is used to interact with the configured authentication provider.
 * The `storage` property is used to store and retrieve files.
 *
 * @public
 */
export type QueryCtx = {
  db: DatabaseReader<DataModel>;
  auth: Auth;
  storage: StorageReader;
};

/**
 * A set of services for use within Convex mutation functions.
 *
 * The mutation context inherits all of the services from the query context and adds the `db` service which allows writing to the database.
 *
 * @public
 */
export type MutationCtx = {
  db: DatabaseWriter<DataModel>;
  auth: Auth;
  storage: StorageWriter;
};