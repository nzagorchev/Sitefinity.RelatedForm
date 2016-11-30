using Telerik.Sitefinity.Web.UI.Fields.Contracts;

namespace SitefinityWebApp.FormSelector
{
    public interface IFormSelectorFieldControlDefinition : IFieldControlDefinition
    {
        /// <summary>
        /// Gets or sets the dynamic module type.
        /// </summary>
        /// <value>The dynamic module type.</value>
        string ModuleType { get; set; }
    }
}