using Telerik.Sitefinity.Configuration;
using Telerik.Sitefinity.Web.UI.Fields.Definitions;

namespace SitefinityWebApp.FormSelector
{
    /// <summary>
    /// A control definition for the simple image field
    /// </summary>
    public class FormSelectorFieldControlDefinition : FieldControlDefinition, IFormSelectorFieldControlDefinition
    {
        #region Constuctors
        /// <summary>
        /// Initializes a new instance of the <see cref="FormSelectorFieldControlDefinition"/> class.
        /// </summary>
        public FormSelectorFieldControlDefinition()
            : base()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="FormSelectorFieldControlDefinition"/> class.
        /// </summary>
        /// <param name="element">The configuration element used to persist the control definition.</param>
        public FormSelectorFieldControlDefinition(ConfigElement element)
            : base(element)
        {
        }
        #endregion

        #region IFormSelectorFieldControlDefinition members
        public string ModuleType
        {
            get
            {
                return this.ResolveProperty("DynamicModuleType", this.dynamicModuleType);
            }
            set
            {
                this.dynamicModuleType = value;
            }
        }
        #endregion

        #region Private members
        private string dynamicModuleType;
        #endregion
    }
}