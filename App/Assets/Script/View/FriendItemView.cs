using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class FriendItemView : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI userID;
    [SerializeField] private TextMeshProUGUI userName;
    [SerializeField] private Image userAvatar;
    [SerializeField] private Sprite defaultSpite;

    // Update is called once per frame
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
