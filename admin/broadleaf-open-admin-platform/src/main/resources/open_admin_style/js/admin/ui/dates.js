/*
 * #%L
 * BroadleafCommerce Open Admin Platform
 * %%
 * Copyright (C) 2009 - 2013 Broadleaf Commerce
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *       http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
(function($, BLCAdmin) {
    
    var adminFormats = {
        blcDateFormat : "yy.mm.dd",
        blcTimeFormat : "HH:mm:ss",
        displayDateFormat : 'mm/dd/yy',
        displayTimeFormat : 'HH:mm:ss',
        displayDateDelimiter : '/'
    };

    // Add utility functions for dates to the BLCAdmin object
    BLCAdmin.dates = {
        /**
         * This function should be called for any element that wants to be a rulebuilder
         */
        initialize : function($element) {
            // Set the value of this datepicker to be the appropriately formatted one
            $element.val($element.val().indexOf(adminFormats.displayDateDelimiter)>=0?this.getDisplayDate(this.getServerDate($element.val())):this.getDisplayDate($element.val()));
            
            // Make it a date-time picker
            $element.datetimepicker({
                showSecond: true,
                timeFormat: 'HH:mm:ss'
            });
        },
        
        /**
         * serverDate should be in the Broadleaf datetime format, "yyyy.MM.dd HH:mm:ss" (Java spec)
         * returns the display format, "mm/dd/yy HH:mm:ss" (JavaScript spec)
         */
        getDisplayDate : function(serverDate) {
            var display = BLC.dates.getDisplayDate(serverDate, adminFormats);
            return display === null || display === undefined || display.constructor !== {}.constructor ? display : display.displayDate + " " + display.displayTime;
        },
        
        /**
         * displayDate should be in the format "mm/dd/yy HH:mm" (JavaScript spec)
         * returns the server-expected format, "yyyy.MM.dd HH:mm:ss Z" (Java spec)
         */
        getServerDate : function(displayDate) {
            var server = BLC.dates.getServerDate(displayDate, adminFormats);
            return server === null || server === undefined || server.constructor !== {}.constructor ? server : server.serverDate + " " + server.serverTime;
        },
        
        initializationHandler : function($container) {
            $container.find('.datepicker').each(function(index, element) {
                BLCAdmin.dates.initialize($(element));
            });
        },
        
        postValidationSubmitHandler : function($form) {
            $form.find('.datepicker').each(function(index, element) {
                var $this = $(this);
                if ($this.closest('.entityFormTab').data('initialized') != 'true') {
                    BLCAdmin.dates.initialize($this);
                }

                var name = $this.attr('name');

                var $hiddenClone = $('<input>', {
                    type: 'hidden',
                    name: name,
                    value: BLCAdmin.dates.getServerDate($this.val()),
                    'class': 'datepicker-clone'
                });
              
                $(this).data('previous-name', name).removeAttr('name').after($hiddenClone);
            });
        },
        
        postFormSubmitHandler : function($form, data) {
            $form.find('.datepicker-clone').each(function(index, element) {
                var $clone = $(this);
                var inputName = $clone.attr('name');
                
                var $originalInput = $clone.siblings('.datepicker');
                
                $originalInput.attr('name', inputName);
                $originalInput.val($clone.val());
                $originalInput.attr('type', 'text');
                $clone.remove();
                
                BLCAdmin.dates.initialize($originalInput);
            });
        }
    };
    
    BLCAdmin.addInitializationHandler(BLCAdmin.dates.initializationHandler);
    BLCAdmin.addPostValidationSubmitHandler(BLCAdmin.dates.postValidationSubmitHandler);
    BLCAdmin.addPostFormSubmitHandler(BLCAdmin.dates.postFormSubmitHandler);
            
})(jQuery, BLCAdmin);

$(document).ready(function() {
  
    $('body').on('click', 'div.datepicker-container', function(event) {
        $(this).find('input').datepicker('show');
    });
    
});
