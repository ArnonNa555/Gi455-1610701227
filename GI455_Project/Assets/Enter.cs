using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Enter : MonoBehaviour
{
    public string EnterInformation;
    public GameObject field;
    public GameObject textDis;
    public string[] InformatioNANA;

    public void InformationName()
    {
        EnterInformation = field.GetComponent<Text>().text;
        textDis.GetComponent<Text>().text = "" + EnterInformation + "";

        if (EnterInformation == InformatioNANA[0])
        {
            textDis.GetComponent<Text>().text = " { " + $"<Color=red>{EnterInformation}</Color>" + " } " + " <Color=blue>is found</Color> ";
            
        }
        else if(EnterInformation == InformatioNANA[1])
        {
            textDis.GetComponent<Text>().text = " { " + $"<Color=red>{EnterInformation}</Color>" + " } " + " <Color=blue>is found</Color> ";
        }
        else if (EnterInformation == InformatioNANA[2])
        {
            textDis.GetComponent<Text>().text = " { " + $"<Color=red>{EnterInformation}</Color>" + " } " + " <Color=blue>is found</Color> ";
        }
        else if (EnterInformation == InformatioNANA[3])
        {
            textDis.GetComponent<Text>().text = " { " + $"<Color=red>{EnterInformation}</Color>" + " } " + " <Color=blue>is found</Color> ";
        }
        else if (EnterInformation == InformatioNANA[4])
        {
            textDis.GetComponent<Text>().text = " { " + $"<Color=red>{EnterInformation}</Color>" + " } " + " <Color=blue>is found</Color> ";
        }
        else
        {
            textDis.GetComponent<Text>().text = " { " + $"<Color=blue>{EnterInformation}</Color>" + " } " + " <Color=red>is not found</Color> ";
        }
    }


}
