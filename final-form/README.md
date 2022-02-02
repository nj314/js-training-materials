# final-form Practice App

## Story #1: Login form

- AC1: Create a page with three text inputs: username, password, and 2FA code.
- AC2: Wrap the text inputs in a `Form` and add a submit button. When Submit is clicked, a popup should open which displays the values from all text inputs. (hint: please use the `Form`'s `submit` prop)
- AC3: Add a Reset button which clears all form values (hint: try `useForm` or [`FormRenderProps`](https://final-form.org/docs/react-final-form/types/FormRenderProps)).
- AC4: Add validation error messages for each of the following conditions. If any condition is not met, the submit button **should still be enabled** but should not open the popup from AC2. (hint: see `FormProps.validate`)
  - Username must be at least 4 characters
  - Password must be at least 8 characters
  - 2FA code is not required, but if provided, it must be a string containing only numbers, e.g. "123"
- AC5: When validation errors occur, render the specific error message in red text under the corresponding text box.
- AC6: Hide all validation error messages until the user has attempted to submit the form at least once.
- AC7: Optimize rendering performance while typing. (hint: using the react devtools, turn on "Highlight updates when components render", then type in any text box. Only the changed components should flash. If other components flash, check your [`subscription`s](https://final-form.org/docs/react-final-form/examples/subscriptions)).
