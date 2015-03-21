using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ExceptionServices;
using System.Text.RegularExpressions;
using System.Web;

namespace MOwZ_Jefferson.Models
{
    public class FileModel
    {
        /// <summary>
        /// Przechowuje odczytaną informację o liczbie stanów.
        /// </summary>
        public int n { get; set; }
        /// <summary>
        /// Przechowuje odczytany rozmiar parlamentu.
        /// </summary>
        public int h { get; set; }
        /// <summary>
        /// Przechowuje odczytaną listę populacji stanów.
        /// </summary>
        public List<int> StatePopuList { get; set; }
        /// <summary>
        /// Odczytuje dane z wejściowego łańcucha znaków
        /// </summary>
        /// <param name="str">Wejściowy łańcuch znaków</param>
        /// <returns>Opis statusu pliku</returns>
        public string StringEncounter(string str)
        {
            string output = "";

            if (str.Contains("-"))
            {
                output += "\nW pliku wystepowały wartości ujemne. Zostały przykształcone w wartości dodatnie";
            }

            Regex rg = new Regex("[^0-9 \r\n]");
            str = rg.Replace(str, "");

            string[] lines = str.Split(new string[] { Environment.NewLine, "\n" }, StringSplitOptions.None);

            //n = //Convert.ToInt32(lines[0].Split(new char[]{' ','\t'}).First());
            h = Convert.ToInt32(lines[0].Split(new char[] { ' ', '\t' }).Last());

            string[] popStr = lines[1].Split(new[] {' ', '\t'});

            StatePopuList = new List<int>();

            foreach (var s in popStr)
            {
                StatePopuList.Add(Convert.ToInt32(s));
            }
            n = StatePopuList.Count;
            output += "\nOK";
            return output;
        }
    }
}