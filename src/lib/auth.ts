import passport from 'passport';
import { Strategy as SamlStrategy, Profile, VerifyWithoutRequest } from '@node-saml/passport-saml';
import { User } from '../types/auth';

const verify: VerifyWithoutRequest = function(profile: Profile | null | undefined, done: (error: Error | null, user?: Record<string, unknown>) => void) {
  if (!profile) {
    return done(new Error('No profile returned from SAML provider'));
  }
  console.log("PROFILE ::: ", profile);

  const user: User = {
    nameID: profile.nameID as string | undefined,
    email: profile.email as string | undefined,
    name: profile.displayName as string | undefined,
  };
  done(null, user);
};

const samlStrategy = new SamlStrategy(
  {
    callbackUrl: 'http://localhost:3000/api/auth/callback',
    entryPoint: 'https://fed.hermes.com/adfs/ls/',
    issuer: 'saml-next-app',
    identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
    acceptedClockSkewMs: -1,
    wantAssertionsSigned: true,
    wantAuthnResponseSigned: false,
    idpCert: '',
    // Add the entity ID from the FederationMetadata.xml
    idpIssuer: 'http://fed.hermes.com/adfs/services/trust',
  },
  verify,
  verify
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((user: User, done) => {
  done(null, user);
});

// @ts-expect-error tototo
passport.use(samlStrategy);

export const authConfig = {
  secret: 'your-session-secret', // Change this in production
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export { passport, samlStrategy };
