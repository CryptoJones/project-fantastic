**fantastic-server**

> [README](../README.md) / [Globals](../globals.md) / "packages/fantastic-default_auth/accounts/verify"

# Module: "packages/fantastic-default_auth/accounts/verify"

## Index

### Variables

* [get](_packages_fantastic_default_auth_accounts_verify_.md#get)

### Functions

* [verify](_packages_fantastic_default_auth_accounts_verify_.md#verify)

## Variables

### get

•  **get**: (query: [Query](_packages_fantastic_utils_db_types_d_.md#query)) => Promise\<{} \| undefined>

*Defined in [packages/fantastic-default_auth/accounts/verify.js:1](https://github.com/besimorhino/project-fantastic/blob/af5d0de/packages/fantastic-default_auth/accounts/verify.js#L1)*

## Functions

### verify

▸ `Const`**verify**(`session_id`: string): Promise\<[User](_packages_fantastic_utils_types_d_.md#user)>

*Defined in [packages/fantastic-default_auth/accounts/verify.js:8](https://github.com/besimorhino/project-fantastic/blob/af5d0de/packages/fantastic-default_auth/accounts/verify.js#L8)*

Get user by session ID

#### Parameters:

Name | Type |
------ | ------ |
`session_id` | string |

**Returns:** Promise\<[User](_packages_fantastic_utils_types_d_.md#user)>
