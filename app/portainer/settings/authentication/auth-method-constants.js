export const authenticationMethodTypesMap = {
  INTERNAL: 1,
  LDAP: 2,
  OAUTH: 3,
};

export const authenticationMethodTypesLabels = {
  [authenticationMethodTypesMap.INTERNAL]: '内部认证',
  [authenticationMethodTypesMap.LDAP]: 'LDAP',
  [authenticationMethodTypesMap.OAUTH]: 'OAuth',
};
