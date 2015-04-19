using System;
using System.Collections.Generic;
using System.EnterpriseServices.CompensatingResourceManager;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using MOwZ_Jefferson.Models;

namespace MOwZ_Jefferson.Controllers
{
    public class HomeController : Controller
    {
        /// <summary>
        /// Strona główna projektu
        /// </summary>
        /// <returns>Widok strony głównej</returns>
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Przesłanie pliku z danymi do serwera
        /// </summary>
        /// <param name="formCollection">"Kolekcja"(parametr przesłany w żądaniu) zawierająca plik z danymi</param>
        /// <returns>JSON z wynikami działania projektu</returns>
        [HttpPost]
        public JsonResult Upload(FormCollection formCollection)
        {
            try
            {
                var resp = "Nope";
                if (Request != null)
                {
                    var file = Request.Files["Upload"];

                    if ((file != null) && (file.ContentLength > 0) && !string.IsNullOrEmpty(file.FileName))
                    {
                        var fileBytes = new byte[file.ContentLength];
                        file.InputStream.Read(fileBytes, 0, Convert.ToInt32(file.ContentLength));
                        resp = System.Text.Encoding.Default.GetString(fileBytes);
                    }
                }
                var fileM = new FileModel();
                var resDat = fileM.StringEncounter(resp);

                if (resDat.Split('\n').Last() != "OK")
                {
                    return Json(new {success = false, FileParserOutput = resDat});
                }
                var jefferson = new JeffersonModel(fileM.n, fileM.h, fileM.StatePopuList, resDat);
                jefferson.LoopToSuccess();
                return Json(jefferson);
            }
            catch
            {
                return Json(new {success = false, FileParserOutput = "\nOgólny błąd aplikacji\nERROR"});
            }
        }

        /// <summary>
        /// Przesłanie danych z formularza na stronie do serwera
        /// </summary>
        /// <param name="N">Parametr określający liczbę stanów.</param>
        /// <param name="H">Parametr określający rozmiar parlamentu.</param>
        /// <param name="Populations">Parametr zawierający kolekcję populacji stanów.</param>
        /// <returns>JSON z wynikami działania projektu.</returns>
        [HttpPost]
        public JsonResult Send(int N, int H, IEnumerable<int> Populations)
        {
            try
            {
                var recivedData = new BasicJeffersonData
                {
                    N = N,
                    H = H,
                    Populations = Populations.ToList()
                };
                var stringifiedForm = recivedData.Stringify();

                var fileM = new FileModel();
                var resDat = fileM.StringEncounter(stringifiedForm);

                if (resDat.Split('\n').Last() != "OK")
                {
                    return Json(new {success = false, FileParserOutput = resDat});
                }
                var jefferson = new JeffersonModel(fileM.n, fileM.h, fileM.StatePopuList, resDat);
                jefferson.LoopToSuccess();
                return Json(jefferson);
            }
            catch
            {
                return Json(new { success = false, FileParserOutput = "\nOgólny błąd aplikacji\nERROR" });
            }
        }
    }
}