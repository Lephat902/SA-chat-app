using System;
using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

class UserProfileView: MonoBehaviour
{
    [Header("UI")]
    [SerializeField] private TextMeshProUGUI userID;
    [SerializeField] private TextMeshProUGUI userName;
    [SerializeField] private Image userAvatar;
    [SerializeField] private Button logOutBtn;

    [Header("Other")]
    [SerializeField] private Sprite defaultSpite;

    private void Start()
    {
        logOutBtn.onClick.AddListener(LogOut);
    }

    private void OnDestroy()
    {
        logOutBtn.onClick.RemoveAllListeners();
    }

    private void LogOut()
    {
        SceneManager.LoadScene("SignIn", LoadSceneMode.Single);
    }

    public void SetUI(string id, string name, string avatarUrl)
    {
        userID.text = id;
        userName.text = name;
        StartCoroutine(LoadImage(avatarUrl));
    }

    private IEnumerator LoadImage(string avatarUrl)
    {
        var www = new WWW(avatarUrl);
        yield return www;

        if (www.texture != null)
            userAvatar.sprite = Sprite.Create(www.texture, new Rect(0, 0, www.texture.width, www.texture.height), new Vector2(0, 0));

        else
            userAvatar.sprite = defaultSpite;
    }
}
