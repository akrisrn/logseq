import { Authenticator, CheckboxField, useAuthenticator } from '@aws-amplify/ui-react'

export function LSAuthenticator ({ children }: any) {
  return (<div>
    <Authenticator
      formFields={{
        signUp: {
          email: { order: 1 },
          username: { order: 2 },
          password: { order: 3 },
          confirm_password: { order: 4 },
        }
      }}
      signUpAttributes={['email']}
      socialProviders={['google']}
      components={{
        SignUp: {
          FormFields () {
            const { validationErrors } = useAuthenticator()

            return (
              <>
                {/* Re-use default `Authenticator.SignUp.FormFields` */}
                <Authenticator.SignUp.FormFields/>

                {/* Append & require Terms & Conditions field to sign up  */}
                <CheckboxField
                  errorMessage={validationErrors.acknowledgement as string}
                  hasError={!!validationErrors.acknowledgement}
                  name="acknowledgement"
                  value="yes"
                  label="I agree with the Terms & Conditions"
                />
              </>
            )
          },
        },
      }}
      services={{
        async validateCustomSignUp (formData) {
          if (formData.hasOwnProperty('acknowledgement') && !formData.acknowledgement) {
            return {
              acknowledgement: 'You must agree to the Terms & Conditions',
            }
          }
        }
      }}
    >
      {children}
    </Authenticator>
  </div>)
}