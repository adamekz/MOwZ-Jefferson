using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MOwZ_Jefferson.Models;
using System.Web.Script.Serialization;
using System.Diagnostics;

namespace MOwZ_Jefferson.Tests
{
    /// <summary>
    /// Klasa zawierająca testy jednostkowe dla projektu MOwZ Jefferson
    /// </summary>
    [TestClass]
    public class JeffersonTests
    {
        /*
         *          TESTY ALGORYTMU
         */
        /// <summary>
        /// Test danych podanych na wykładzie (po zmianie)
        /// </summary>
        [TestMethod]
        public void SimpleData()
        {
            Console.WriteLine("Simple data test started");
            var test = new JeffersonModel(5, 105, new List<int> {105350, 128500, 153120, 98530, 117200}, "OK");
            test.LoopToSuccess();
            var json = new JavaScriptSerializer().Serialize(test);
            Console.Write(json);
            Assert.AreEqual(true, test.PlacmentsList.Last().SeatsPerStateList.SequenceEqual(new List<int>{18,23,27,17,20}));
        }
        /// <summary>
        /// Test danych dotyczących współczesnych Stanów Zjednoczonych
        /// </summary>
        [TestMethod]
        public void PresentUSA()
        {
            Console.WriteLine("Present USA test started");
            var test = new JeffersonModel(51, 435, new List<int>
            {//na podstawie http://pl.wikipedia.org/wiki/Stany_USA_wed%C5%82ug_liczby_ludno%C5%9Bci
                37253956,
                25145561,
                19378102,
                18801310,
                12830632,
                12702379,
                11536504,
                9883640,
                9687653,
                9535483,
                8791894,
                8001024,
                6724540,
                6547629,
                6483802,
                6392017,
                6346105,
                5988927,
                5773552,
                5686986,
                5303925,
                5029196,
                4779736,
                4625364,
                4533372,
                4339367,
                3831074,
                3751351,
                3574097,
                3046355,
                2967297,
                2915918,
                2853118,
                2763885,
                2700551,
                2059179,
                1852994,
                1826341,
                1567582,
                1360301,
                1328361,
                1316470,
                1052567,
                989415,
                900877,
                814180,
                710231,
                672591,
                625741,
                601723,
                563626
            }, "\nOK");
            Stopwatch sw = new Stopwatch();
            sw.Start();
            test.LoopToSuccess();
            var json = new JavaScriptSerializer().Serialize(test);
            sw.Stop();
            Console.WriteLine("Test took " + sw.Elapsed + " and produce " + test.PlacmentsList.Count + " placement attemps.");
            Console.Write(json);
            Assert.AreEqual(0, test.PlacmentsList.Last().DividerCode);
        }
        /// <summary>
        /// Test przydziału dla założonych wartości maksymalnych
        /// </summary>
        [TestMethod]
        public void MaximumPlacement()
        {
            Console.WriteLine("Maximum values test started");
            var l = new List<int>();
            for (int i = 0; i < 10000; i++)
            {
                l.Add(200000);
            }
            var test = new JeffersonModel(10000, 100000, l, "\nOK");
            test.LoopToSuccess();
            var json = new JavaScriptSerializer().Serialize(test);
            Console.WriteLine("Test produce " + test.PlacmentsList.Count + " placement attemps.");
            Console.Write(json);
            Assert.AreEqual(0, test.PlacmentsList.Last().DividerCode);
        }
        /// <summary>
        /// Test przypadku w którym marlament ma tylko jedno miejsce
        /// </summary>
        [TestMethod]
        public void OnePlace()
        {
            Console.WriteLine("One place test started");
            var test = new JeffersonModel(4, 1, new List<int> { 10, 15, 25, 50 }, "OK");
            test.LoopToSuccess();
            var json = new JavaScriptSerializer().Serialize(test);
            Console.Write(json);
            Assert.AreEqual(0, test.PlacmentsList.Last().DividerCode);
        }
        /// <summary>
        /// Przypadek w którym populacja jest równa parlamentowi
        /// </summary>
        [TestMethod]
        public void EqualPopAndPar()
        {
            Console.WriteLine("Equal population and parlament test started");
            var test = new JeffersonModel(4, 100, new List<int> { 10, 15, 25, 50 }, "OK");
            test.LoopToSuccess();
            var json = new JavaScriptSerializer().Serialize(test);
            Console.Write(json);
            Assert.AreEqual(0, test.PlacmentsList.Last().DividerCode);
        }
        /*
         *          TESTY PARSERA
        */
        /// <summary>
        /// Test znaków nowej linii
        /// </summary>
        [TestMethod]
        public void CRLFStringsTest()
        {
            var string1 = "5 5\n1 1 1 1 1";
            var f = new FileModel();
            var st1 = f.StringEncounter(string1);
            Assert.AreEqual("OK",st1.Split('\n').Last());
            var string2 = "5 5\r1 1 1 1 1";
            var st2 = f.StringEncounter(string2);
            Assert.AreEqual("OK", st2.Split('\n').Last());
            var string3 = "5 5\r\n1 1 1 1 1";
            var st3 = f.StringEncounter(string3);
            Assert.AreEqual("OK", st3.Split('\n').Last());
        }
        /// <summary>
        /// Sprawdzenie wartości minimalnych
        /// </summary>
        [TestMethod]
        public void MinValuesTest()
        {
            var vals = "0 0\n0";
            var result = new FileModel().StringEncounter(vals);
            Assert.AreEqual("ERROR",result.Split('\n').Last());
        }
        /// <summary>
        /// Test sprawdzający parsowanie wartości maksymalnych
        /// </summary>
        [TestMethod]
        public void MaxValuesTest()
        {
            var vals = "10000 100000\n";
            for (int i = 0; i < 10000; i++)
            {
                vals += "200000 ";
            }
            vals = vals.Remove(vals.Count() - 1);
            var result = new FileModel().StringEncounter(vals);
            Assert.AreEqual("OK",result.Split('\n').Last());
        }
        /// <summary>
        /// Sprawdzenie przypadku gdy populacja jest mniejsza od rozmiaru parlamentu.
        /// </summary>
        [TestMethod]
        public void PopToParliment()
        {
            var vals = "5 1000\n10 10 10 10 10";
            var result = new FileModel().StringEncounter(vals);
            Assert.AreEqual(true,result.Contains("Całkowita populacja mniejsza od rozmiaru parlamentu"));
        }
        /// <summary>
        /// Sprawdzenie przypadku gdy populacja jest mniejsza od rozmiaru parlamentu.
        /// </summary>
        [TestMethod]
        public void StateNumberMismatch()
        {
            var vals = "5 10\n10 10";
            var result = new FileModel().StringEncounter(vals);
            Assert.AreEqual(true, result.Contains("Liczba stanów nie odpaowiada rozmiarowi kolekcji populacji stanów."));
        }
        /// <summary>
        /// Test 10000 losowych ciągów znaków
        /// </summary>
        [TestMethod]
        public void RandomCheck()
        {
            Random rnd = new Random();
            for (int i = 0; i < 10000; i++)
            {
                
                    var n = rnd.Next(96)+2;
                    var h = rnd.Next(900) + 100;
                    var str = n.ToString() + " " + h + "\n";
                    for (int j = 0; j < n - 1; j++)
                    {
                        str += (rnd.Next(5000000) + 100).ToString() + " ";
                    }
                    str += (rnd.Next(5000000) + 100).ToString();
                    var res = new FileModel().StringEncounter(str);
                    Console.WriteLine("OK:    "+str+"\n"+res);
                    Assert.AreEqual("OK",res.Split('\n').Last());
                
            }
        }
        /// <summary>
        /// Test wywołujący wyjątek TendToInfinityException
        /// </summary>
        [TestMethod]
        public void TestTendToInf()
        {
            var test = new JeffersonModel(3, 321, new List<int> {111, 222, 333}, "\nOK");
            try
            {
                test.LoopToSuccess();
            }
            catch (TendToInfinityException)
            {
                Assert.IsTrue(true);
            }
        }
    }
}
