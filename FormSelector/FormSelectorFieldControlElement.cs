using System;
using System.Configuration;
using Telerik.Sitefinity.Configuration;
using Telerik.Sitefinity.Web.UI;
using Telerik.Sitefinity.Web.UI.Fields.Config;

namespace SitefinityWebApp.FormSelector
{
    /// <summary>
    /// A configuration element used to persist the properties of <see cref="FormSelectorFieldControlDefinition"/>
    /// </summary>
    public class FormSelectorFieldControlElement : FieldControlDefinitionElement, IFormSelectorFieldControlDefinition
    {
        #region Constructors
        /// <summary>
        /// Initializes a new instance of the <see cref="FormSelectorFieldControlElement"/> class.
        /// </summary>
        /// <param name="parent">The parent.</param>
        public FormSelectorFieldControlElement(ConfigElement parent)
            : base(parent)
        {
        }
        #endregion

        #region FieldControlDefinitionElement Members
        /// <summary>
        /// Gets an instance of the <see cref="FormSelectorFieldControlDefinition"/> class.
        /// </summary>
        public override DefinitionBase GetDefinition()
        {
            return new FormSelectorFieldControlDefinition(this);
        }
        #endregion

        #region IFieldDefinition members
        public override Type DefaultFieldType
        {
            get
            {
                return typeof(FormSelectorFieldControl);
            }
        }
        #endregion

        #region IFormSelectorFieldControlDefinition Members
        /// <summary>
        /// Gets or sets the dynamic module type
        /// </summary>
        [ConfigurationProperty("DynamicModuleType")]
        public string ModuleType
        {
            get
            {
                return (string)this["DynamicModuleType"];
            }
            set
            {
                this["DynamicModuleType"] = value;
            }
        }
        #endregion
    }
}