const getAuthResponse = (user, auth) => {

  return {
    profileObject: {
      id: user.id,
      email: user.email,
      givenName: user.givenName,
      familyName: user.familyName,
      role: user.role,
      imageUrl: user.imageUrl,
      memberSince: user.createdAt,
      emailVerified: user.emailVerified,
    },
    tokenObject: {
      token: auth.token,
      expiresIn: auth.expiresIn,
    }
  };

} 

module.exports = getAuthResponse;