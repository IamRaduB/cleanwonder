export interface CustomResponse {
  status: ResponseCodes;
  message: string;
}

export enum ResponseCodes {
  SUCCESS = 1000,
  /**
   * Email link has already been clicked
   */
  ALREADY_VALIDATED = 1001,
  /**
   * Email link has not been clicked
   */
  NOT_VALIDATED = 1002,
  /**
   * Profile data has not been completed
   */
  NO_PROFILE = 1003,
}

export default () => ({
  clientDomain: process.env.CLIENT_DOMAIN || 'hovrcat.me',
  corsOrigin: process.env.CORS_ORIGIN.split(','),
  registrationUrl: process.env.REGISTRATION_URL || 'auth/complete-registration',
  forgotPasswordUrl: process.env.REGISTRATION_URL || 'auth/reset-password',
  patient: {
    clientDomain: process.env.PATIENT_CLIENT_DOMAIN || 'patient.hovrcat.me',
    registrationUrl: process.env.PATIENT_REGISTRATION_URL || 'auth/complete-registration',
  },
  isProduction: process.env.NODE_ENV !== 'development',
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION || 60,
  },
  email: {
    from: 'noreply@hovrcat.me',
    subject: 'Practitioner welcome email',
  },
  localImageStorage: process.env.LOCAL_IMAGE_STORAGE || './tempImages',
  imagekitServiceAccountPath: process.env.IM_KIT_SERVICE_ACCOUNT_PATH,
  storageServiceAccountPath: process.env.STORAGE_SERVICE_ACCOUNT_PATH,
  storage: {
    images: {
      bucketName: process.env.IMAGES_BUCKET || 'medicall-images_test',
      clinicPath: 'clinic',
      practitionerPath: 'practitioner',
      patientPath: 'patient',
    },
  },
});
