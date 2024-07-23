// Commented because not essential at the moment, will be used for Reset Password feature
// 
// import React from 'react';
// import { sendEmailVerification, User } from 'firebase/auth';
// import { toast } from 'react-toastify';
// import renderButton from './RenderButton';
// import getTabData from './GetTabData';
// import { showToastMessage } from 'utils';
// import { useTranslation } from 'react-i18next';

// const EmailVerificationSection = ({
//   currentUser,
//   verifiable,
//   setVerifiable,
//   editMode,
// }: {
//   currentUser: User | null;
//   verifiable: boolean;
//   setVerifiable: (value: boolean) => void;
//   editMode: boolean;
// }) => {
//   const { t: text } = useTranslation();

//   const verifyEmail = () => {
//     if (!currentUser) return;

//     sendEmailVerification(currentUser)
//       .then(() => {
//         showToastMessage(text('EMAIL_VERIFICATION_SENT'), toast.POSITION.TOP_CENTER, true);
//         setVerifiable(false);
//       })
//       .catch((error) => {
//         showToastMessage(
//           text('EMAIL_VERIFICATION_ERROR'), // Assuming you have an error message set up
//           toast.POSITION.TOP_CENTER,
//           true,
//         );
//         console.error('Email verification error:', error);
//       });
//   };

//   const VerificationButton = () => renderButton(text('VERIFY'), verifyEmail, !verifiable, false);

//   const emailVerified = currentUser?.emailVerified ?? false;

//   return emailVerified
//     ? getTabData(text('EMAIL_VALIDATED'), text('YES'), editMode)
//     : getTabData(text('EMAIL_VALIDATED'), '', editMode, <VerificationButton />);
// };

// export default EmailVerificationSection;
