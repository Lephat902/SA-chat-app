using TMPro;
using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class UserProfileController : MonoBehaviour
{
    [Header("Data")]
    [SerializeField] private UserDataAsset userDataAsset;

    [Header("UI")]
    [SerializeField] private Image avatarImg;
    [SerializeField] private TextMeshProUGUI nameTxt;

    [Header("Other")]
    [SerializeField] private Sprite defaultSpite;

    void Start()
    {
        nameTxt.text = userDataAsset.UserDataModel.username;
        StartCoroutine(LoadImage());
    }

    private IEnumerator LoadImage()
    {
        WWW www = new WWW(userDataAsset.UserDataModel.avatar);
        yield return www;

        if (www.texture != null)
            avatarImg.sprite = Sprite.Create(www.texture, new Rect(0, 0, www.texture.width, www.texture.height), new Vector2(0, 0));

        else
            avatarImg.sprite = defaultSpite;
    }
}
