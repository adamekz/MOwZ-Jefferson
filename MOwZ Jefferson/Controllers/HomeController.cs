using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using MOwZ_Jefferson.Models;

namespace MOwZ_Jefferson.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        public JsonResult Upload(FormCollection formCollection)
        {
            var resp = "Nope";
            if (Request != null)
            {
                HttpPostedFileBase file = Request.Files["Upload"];

                if ((file != null) && (file.ContentLength > 0) && !string.IsNullOrEmpty(file.FileName))
                {
                    string fileName = file.FileName;
                    string fileContentType = file.ContentType;
                    byte[] fileBytes = new byte[file.ContentLength];
                    file.InputStream.Read(fileBytes, 0, Convert.ToInt32(file.ContentLength));
                    resp= System.Text.Encoding.Default.GetString(fileBytes);
                }
            }

            var fileM = new FileModel();
            var resDat = fileM.StringEncounter(resp);

            var jefferson = new JeffersonModel(fileM.n, fileM.h, fileM.StatePopuList, resDat);
            jefferson.LoopToSuccess();
            var result = new JsonResult();
            result.Data = new JavaScriptSerializer().Serialize(jefferson);

            return result;
        }
    }
}