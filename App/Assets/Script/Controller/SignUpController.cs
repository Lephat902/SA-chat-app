using UnityEngine.Networking;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

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

        using UnityWebRequest request = UnityWebRequest.Post(StaticURL.DOMAIN + "/signUp", JsonUtility.ToJson(data));

        request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
            statusText.text = request.error;

        else
        {
            statusText.text = "Sign up success!";
            StartHome();
        }
    }

    private void SwitchToSignIn()
    {
        signUpObject.SetActive(false);
        signInObject.SetActive(true);
    }

    private void SignIn()
    {
        var data = new SignInModel()
        {
            username = signUpUserName.text,
            password = signUpPassWord.text
        };

        using UnityWebRequest request = UnityWebRequest.Post(StaticURL.DOMAIN + "/signIn", JsonUtility.ToJson(data));

        if (request.result != UnityWebRequest.Result.Success)
            statusText.text = request.error;

        else
        {
            statusText.text = "Sign In success!";
            StartHome();
        }
    }

    private void SwitchToSignUp()
    {
        signUpObject.SetActive(true);
        signInObject.SetActive(false);
    }

    private void StartHome() { }
}
