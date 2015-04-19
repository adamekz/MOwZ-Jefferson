using System;
using System.Collections.Generic;
using System.Linq;


namespace MOwZ_Jefferson.Models
{
    /// <summary>
    /// Klasa opisująca dane potrzebne do działania systemu
    /// </summary>
    public class JeffersonModel
    {
        /// <summary>
        /// Flaga informujaca o powodzeniu operacji
        /// </summary>
        public bool success { get; set; }
        /// <summary>
        /// Informacje o pilku przekazane z parsera pliku
        /// </summary>
        public string FileParserOutput { get; set; }
        /// <summary>
        /// Liczba stanów
        /// </summary>
        public int StateNo { get; set; }
        /// <summary>
        /// Rozmiar parlamentu
        /// </summary>
        public int ParlamentSize { get; set; }
        /// <summary>
        /// Lista zawierająca liczebność stanów
        /// </summary>
        public List<int> StatePolulationList { get; set; } 
        /// <summary>
        /// Całkowita populacja
        /// </summary>
        public int PopulationOverall { get; set; }
        /// <summary>
        /// Lista zawierająca próby podziału miejsc
        /// </summary>
        public List<SeatsPlacement> PlacmentsList { get; set; }
        /// <summary>
        /// Konstruktor klasy zawierającej informacje o parlamencie, stanach i populacji.
        /// </summary>
        /// <param name="n">Liczba stanów</param>
        /// <param name="l">Rozmiar parlamentu</param>
        /// <param name="statePopList">Lista populacji stanów</param>
        /// <param name="filePrserOut">Wyjście danych przetworzonych przez parser pliku wejściowego</param>
        public JeffersonModel(int n, int l, List<int> statePopList, string filePrserOut)
        {
            StateNo = n;
            ParlamentSize = l;
            StatePolulationList = statePopList;
            PopulationOverall = StatePolulationList.Sum();
            PlacmentsList = new List<SeatsPlacement>();
            FileParserOutput = filePrserOut;
            success = false;
        }
        /// <summary>
        /// Liczy dzielnik, wartości kwot oraz przydział miejsc. Zwraca również kod dzielnika.
        /// </summary>
        /// <returns>Propozycję podziału miejsc, wraz z informacją czy operacja była udana</returns>
        private SeatsPlacement DoTheJobPlacement()
        {
            var placement = new SeatsPlacement();
            if (this.PlacmentsList.Count == 0)
            {
                placement.Divider = placement.CalcStandardDivider(this.PopulationOverall, this.ParlamentSize);
            }
            else
            {
                placement.Divider = placement.CalcModifiedDivider(PlacmentsList);
            }
            placement.CalculatedQuotaList = placement.CalcQuotas(this.StatePolulationList, placement.Divider).ToList();
            placement.SeatsPerStateList = placement.CalcSeatsPerState(placement.CalculatedQuotaList).ToList();
            placement.DividerCode = placement.GradeDivider(this.ParlamentSize, placement.SeatsPerStateList);
            return placement;
        }
        /// <summary>
        /// Metoda wypełniająca listę z próbami przydziału. Jest główną metodą tego modelu.
        /// </summary>
        public void LoopToSuccess()
        {
            do
            {
                this.PlacmentsList.Add(DoTheJobPlacement());
            } while (this.PlacmentsList.Last().DividerCode != 0);
            success = true;
        }
    }
    /// <summary>
    /// Klasa opisująca próby podziału miejsc w parlamencie
    /// </summary>
    public class SeatsPlacement
    {
        /// <summary>
        /// Lista kwot dla stanów obliczona wg. dzielnika standardowego
        /// </summary>
        public List<float> CalculatedQuotaList { get; set; } 
        /// <summary>
        /// Lista przydziału miejsc dla stanu
        /// </summary>
        public List<int> SeatsPerStateList { get; set; }
        /// <summary>
        /// Dzielnik standardowy lub zmodyfikowany
        /// </summary>
        public int Divider { get; set; }
        /// <summary>
        /// Określa ocenę dzielnika: -1 - dzielnik za duży, 0 - przydział zakończony sukcesem, 1 - dzielnik za mały
        /// </summary>
        public int DividerCode { get; set; }
        /// <summary>
        /// Oblicza dzielnik standardowy z podstawowych danych.
        /// </summary>
        /// <param name="population">Całkowita populacja</param>
        /// <param name="parlimentSize">Rozmiar parlamentu</param>
        /// <returns>Dzielnik standardowy, zaokrąglony w dół do wartości całkowitej</returns>
        public int CalcStandardDivider(int population, int parlimentSize)
        {
            return (int)Math.Floor((double)population/(double)parlimentSize);
        }
        /// <summary>
        /// Wyznacza dzielnik zmodyfikowany na podstawie poprzednich wyznaczeń (metoda "prób i błędów")
        /// </summary>
        /// <param name="prevSeats">Lista poprzednich podziałów miejsc</param>
        /// <returns>Dzielnik zmodyfikowany, zaokrąglony w dół do wartości całkowitej.</returns>
        public int CalcModifiedDivider(List<SeatsPlacement> prevSeats)
        {
            //górny i dolny z dzielnika standardowego
            int upper = prevSeats[0].Divider;
            int lower = prevSeats[0].Divider;
            //limity z wartości skrajnych dzielników
            int uLimit = 0;
            int lLimit = 0;

            Random random = new Random();
            var range = (int)Math.Floor(prevSeats.Last().Divider * 0.1);

            try
            {
                uLimit = prevSeats.Where(x => x.DividerCode == -1).Min(x => x.Divider);
            }
            catch
            {
                uLimit = random.Next(prevSeats.Last().Divider, prevSeats.Last().Divider + range);
            }
            try
            {
                lLimit = prevSeats.Where(x => x.DividerCode == 1).Max(x => x.Divider);
            }
            catch
            {
                lLimit = random.Next(prevSeats.Last().Divider - range, prevSeats.Last().Divider); 
            }
            //ostatni za duży dzielnik
            if (prevSeats.Count(x => x.DividerCode == -1)!=0)
            {
               /* for (int i = prevSeats.Count - 1; i >= 0; i--)
                {
                    if (prevSeats[i].DividerCode == -1 && prevSeats[i].Divider < upper)
                    {
                        upper = prevSeats[i].Divider;
                        break;
                    }
                }*/
                upper = prevSeats.Where(x => x.DividerCode == -1).Min(x => x.Divider);
            }
            else
            {
                upper = random.Next(prevSeats.Last().Divider, prevSeats.Last().Divider + range);
            }
            //ostatni za mały dzielnik
            if (prevSeats.Count(x => x.DividerCode == 1) != 0)
            {
                /*for (int i = prevSeats.Count - 1; i >= 0; i--)
                {
                    if (prevSeats[i].DividerCode == 1 && prevSeats[i].Divider > lower)
                    {
                        lower = prevSeats[i].Divider;
                        break;
                    }
                }*/
                lower = prevSeats.Where(x => x.DividerCode == 1).Max(x => x.Divider);
            }
            else
            {
                lower = random.Next(prevSeats.Last().Divider - range, prevSeats.Last().Divider); 
            }
            //jeżeli wartości są takie same, wtedy losuje wartości w przedziale +-10%
            if (upper == lower)
            {
                lower = random.Next(lower - range, lower);
                upper = random.Next(upper, upper + range);
                if (lower < lLimit) lower = lLimit;
                if (upper > uLimit) upper = uLimit;
            }
            int div = 0;
            int cnt = 0;
            //szukanie dzielnika który jeszcze nie był sprawdzany
            do
            {
                cnt++;
                div = (int) Math.Floor(((double) upper + (double) lower)/2);
                //awaryjne zwiększanie lub zmniejszanie dzielnika
                if (cnt == 100)
                {
                    do
                    {
                        if (prevSeats.Last().DividerCode == 1)
                        {
                            div--;
                        }
                        else
                        {
                            div++;
                        }
                    } while (prevSeats.Any(x => x.Divider == div));
                    break;
                }
            } while (prevSeats.Any(x => x.Divider == div));
            
            return div;
            
        }
        /// <summary>
        /// Tworzy kolekcję kwot pozwalającą na podział miejsc w parlamencie
        /// </summary>
        /// <param name="statesPopulList">Lista populacji poszczególnych stanów</param>
        /// <param name="divider">Dzielnik</param>
        /// <returns>Kolekcja kwot dla poszczególnych stanów</returns>
        public IEnumerable<float> CalcQuotas(List<int> statesPopulList, int divider)
        {
            foreach (var population in statesPopulList)
            {
                yield return population/(float)divider ;
            }
        }
        /// <summary>
        /// Tworzy kolekcję liczby miejsc dla poszczególnych stanów
        /// </summary>
        /// <param name="quotasList">Lista kwot</param>
        /// <returns>Kolekcja zawierająca liczbę miejsc dla poszczególnych stanów</returns>
        public IEnumerable<int> CalcSeatsPerState(List<float> quotasList)
        {
            foreach (var quota in quotasList)
            {
                yield return (int) Math.Floor(quota);
            }
        }
        /// <summary>
        /// Wystawia ocenę przydziałowi na podstawie rozmiaru parlamentu i faktycznego podziału.
        /// </summary>
        /// <param name="parlimentSize">Rozmiar parlamentu</param>
        /// <param name="seatsList">Lista przydziałów</param>
        /// <returns>Kod oceny: 0 - przydział udany, 1 - dzielnik za duży, -1 - dzielnik za mały</returns>
        public int GradeDivider(int parlimentSize, List<int> seatsList)
        {
            if (parlimentSize == seatsList.Sum())
            {
                return 0;
            }
            else if(parlimentSize > seatsList.Sum())
            {
                return -1;
            }
            else
            {
                return 1;
            }
        }
    }
    /// <summary>
    /// Klasa przeznaczona dla danych z formularza
    /// </summary>
    class BasicJeffersonData
    {
        /// <summary>
        /// Liczba stanów
        /// </summary>
        public int N;
        /// <summary>
        /// Rozmiar parlamentu
        /// </summary>
        public int H;
        /// <summary>
        /// Lista populacji stanów
        /// </summary>
        public List<int> Populations;
        /// <summary>
        /// Metoda tworząca format danych wejściowych walidatora.
        /// </summary>
        /// <returns>Napis w formacie odpowiadającym temu z plików.</returns>
        public string Stringify()
        {
            var result = N.ToString() + " " + H.ToString() + "\n";
            result = Populations.Aggregate(result, (current, population) => current + (population.ToString() + " "));
            result = result.Remove(result.Count() - 1);
            return result;
        }
    }
    
}