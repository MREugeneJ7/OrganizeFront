import Keycloak from "keycloak-js";

const keycloakInstance = Keycloak("/keycloak.json"); 

interface CallbackOneParam<T1 = void, T2 = void> {
  (param1: T1): T2;
}
/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const Login = (onAuthenticatedCallback: CallbackOneParam) => {
  keycloakInstance
    .init({checkLoginIframe: false,
        onLoad: "login-required"
    })
    .success(function (authenticated ) {
      authenticated ? onAuthenticatedCallback() : alert("non authenticated");
    })
    .error((e) => {
      console.dir(e);
      console.log(`keycloak init exception: ${e}`);
    });
};



const Id = (): string | undefined =>
  keycloakInstance?.tokenParsed?.sub;

const Token = (): string | undefined => keycloakInstance?.token;

const LogOut = () => keycloakInstance.logout();

const Admin = (): boolean => {
  return keycloakInstance.hasResourceRole("admin", "CaloriesApp") || keycloakInstance.hasResourceRole("trainer", "CaloriesApp")
}

const KeyCloakService = {
  CallLogin: Login,
  GetId: Id,
  GetAccesToken: Token,
  CallLogOut: LogOut,
  IsUserAdmin: Admin,
};

export default KeyCloakService;