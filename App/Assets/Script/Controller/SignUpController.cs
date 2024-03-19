using UnityEngine.Networking;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using Cysharp.Threading.Tasks;
using System.Collections;
using UnityEngine.SceneManagement;

public class SignUpController : MonoBehaviour
{
    [Header("SignUp")]
    [SerializeField] private GameObject signUpObject;
    [SerializeField] private TMP_InputField signUpUserName;
    [SerializeField] private TMP_InputField signUpPassWord;
    [SerializeField] private TMP_InputField signUpAvatar;
    [SerializeField] private Button signUpButton;
    [SerializeField] private Button signUpSwitch;

    [Header("SignIn")]
    [SerializeField] private GameObject signInObject;
    [SerializeField] private TMP_InputField signInUserName;
    [SerializeField] private TMP_InputField signInPassWord;
    [SerializeField] private Button signInButton;
    [SerializeField] private Button signInSwitch;

    [Header("Other")]
    [SerializeField] private TextMeshProUGUI statusText;

    [Header("Data")]
    [SerializeField] private UserDataAsset userDataAsset;

    void Start()
    {
        signUpButton.onClick.AddListener(SignUp);
        signUpSwitch.onClick.AddListener(SwitchToSignIn);
        signInButton.onClick.AddListener(SignIn);
        signInSwitch.onClick.AddListener(SwitchToSignUp);
    }

    private void OnDestroy()
    {
        signUpButton.onClick.RemoveAllListeners();
        signUpSwitch.onClick.RemoveAllListeners();
        signInButton.onClick.RemoveAllListeners();
        signInSwitch.onClick.RemoveAllListeners();
    }

    private void SignUp()
    {
        var data = new SignUpModel()
        {
            username = signUpUserName.text,
            password = signUpPassWord.text,
            avatar = signUpAvatar.text
        };

        CustomHTTP.SignUp(CustomHTTP.DOMAIN + "/signUp", data,
            (res) =>
            {
                userDataAsset.AccessToken = res.accessToken;
                statusText.text = "Sign Up success!";
                StartHome(signUpUserName.text);
            },
            (err) => { statusText.text = err.message[0]; });
    }

    private void SwitchToSignIn()
    {
        signUpObject.SetActive(false);
        signInObject.SetActive(true);
        ClearStatus();
    }

    private void SignIn()
    {
        var data = new SignInModel()
        {
            username = signInUserName.text,
            password = signInPassWord.text
        };

        CustomHTTP.SignUp(CustomHTTP.DOMAIN + "/signIn", data,
            (res) =>
            {
                userDataAsset.AccessToken = res.accessToken;
                statusText.text = "Sign In success!";
                StartHome(signInUserName.text);
            },
            (err) => { statusText.text = err.message[0]; });
    }

    private void SwitchToSignUp()
    {
        signUpObject.SetActive(true);
        signInObject.SetActive(false);
        ClearStatus();
    }

    private void ClearStatus() => statusText.text = string.Empty;

    private void StartHome(string userName) {
        CustomHTTP.Profile(CustomHTTP.DOMAIN + $"/users/username/{userName}/profile",
            (res) =>
            {
                userDataAsset.AccessToken = res.accessToken;
                userDataAsset.UserDataModel = res;
                statusText.text = "Loading to Home!";
                SceneManager.LoadScene("Home", LoadSceneMode.Single);
            },
            (err) => { statusText.text = err.message; });
    }
}
