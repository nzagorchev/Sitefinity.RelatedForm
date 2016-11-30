using System;
using System.Web.Mvc;
using Telerik.Sitefinity.Frontend.Forms.Mvc.Controllers;
using Telerik.Sitefinity.Mvc.ActionFilters;

namespace SitefinityWebApp.Mvc.Controllers
{
    public class FormCustomController : FormController
    {
        public ActionResult IndexCustom(string id)
        {
            this.Model.FormId = new Guid(id);
            this.Model.UseAjaxSubmit = true;
            this.Model.AjaxSubmitUrl = "/customprefix/FormCustom/AjaxSubmitCustom";
            // Resolve scripts and styles using the default Controller
            this.ControllerContext.RouteData.Values.Add("widgetName", "FormController");
            return base.Index();
        }

        [HttpPost]
        [StandaloneResponseFilter]
        public JsonResult AjaxSubmitCustom(FormCollection collection)
        {
            if (collection != null)
            {
                var id = collection["Id"];
                if (!string.IsNullOrEmpty(id))
                {
                    this.Model.FormId = Guid.Parse(id);
                }
            }

            return base.AjaxSubmit(collection);
        }
    }
}