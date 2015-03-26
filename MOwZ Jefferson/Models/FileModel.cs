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
                output += "\nW pliku wystepowały wartości ujemne. Zostały przykształcone w wartości dodatnie.";
            }
            if (str.Contains(".") || str.Contains(","))
            {
                output += "\nW pliku występowały liczby niecałkowite. Znaki \".\" i/lub \",\" zostały usunięte.";
            }

            Regex rg = new Regex("[^0-9 \r\n\t]");
            
            str = rg.Replace(str, "");

            try
            {
                string[] lines = str.Split(new string[] {Environment.NewLine, "\n", "\r"}, StringSplitOptions.None);
                try
                {
                    n = Convert.ToInt32(lines[0].Split(new char[] {' ', '\t'}).First());
                    h = Convert.ToInt32(lines[0].Split(new char[] {' ', '\t'}).Last());
                }
                catch
                {
                    output += "\nParametry n i h niezdatne do odczytu";
                    throw new Exception();
                }
                
                try
                {
                    string[] popStr = lines[1].Split(new[] {' ', '\t'});

                    StatePopuList = new List<int>();

                    foreach (var s in popStr)
                    {
                        StatePopuList.Add(Convert.ToInt32(s));
                    }
                }
                catch
                {
                    output += "\nLista populacji stanów zawiera błędy";
                    throw new Exception();
                }
                var errorFlag = false;
                if (n <= 2 || h <= 2 )
                {
                    output += "\nParametry n i h pnizej minimów";
                    errorFlag = true;
                }
                if (StatePopuList.FindAll(x => x == 0).Count > (StatePopuList.Count/2))
                {
                    output += "\nPonad połowa wartości na liście populacji jest równa zero";
                    errorFlag = true;
                }
                if (n > 10000 || h > 100000 || StatePopuList.Exists(x => x > 20000000))
                {
                    output += "\nWartości przekraczają założone maksymalne progi";
                    errorFlag = true;
                }
                if (StatePopuList.Sum() > 4000000000)
                {
                    output += "\nŁączna suma populacji przekracza dopuszczalne maksimum";
                    errorFlag = true;
                }
                if (StatePopuList.Sum() < h)
                {
                    output += "\nCałkowita populacja mniejsza od rozmiaru parlamentu";
                    errorFlag = true;
                }
                if (StatePopuList.Count != n)
                {
                    output += "\nLiczba stanów nie odpaowiada rozmiarowi kolekcji populacji stanów.";
                    errorFlag = true;
                }
                if (errorFlag)
                {
                    throw new Exception();
                }
                output += "\nOK";
            }
            catch (ArgumentException ae)
            {
                output += "\nOgólny błąd ciągu znaków - nieprawidłowy format łańcucha";
            }
            catch(Exception e)
            {
                output += "\nERROR";
            }
            return output;
        }
    }
}