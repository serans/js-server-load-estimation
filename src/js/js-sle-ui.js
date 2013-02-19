/*  js-server-load-estimation
    Copyright (C) 2013  Miguel Hermo Serans

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    contact: code@mhserans.com
*/

  var nrows=0;
  var plot;
  
  function readConfig() {
        function readValue(key, suffix) {
            if(suffix==undefined) suffix=""
            val=0;
            if($('#'+key+suffix).val()!=undefined) val=$('#'+key+suffix).val();
            return val;
        }
        
        config = {
            "ppv": readValue("ppv"),
            "hpp": readValue("hpp"),
            "qpp": readValue("qpp"),
            "nservers": readValue("nservers"),
            "notes": readValue("notes"),
        };
        
        var demoItems = $('#demographic-data-table').children();
        if( demoItems.length > 0 ) {
            config.demo_table = new Array();
            $.each( demoItems, function(i,v) {
                nid = ( $(v).attr('id').match(/(demographic-data-row-)([0-9]*)/)[2] );
                config.demo_table.push ({
                    "n_visits":$("#n_visits_"+nid).val(),
                    "peak_time": parseInt($("#peak_time_h_"+nid).val())*60+parseInt($("#peak_time_m_"+nid).val()),
                    "peak_percent":$("#peak_percent_"+nid).val(),
                });
                
            });
        }
        
        if($('#useCDN').is(':checked')) {
            config.cdn = $('#slider_webserver').slider('value');
        }
        
        return config;
  }

  function importJSON(jsonConfig) {
        function applyValue(key) {
            if(jsonConfig[key]!=undefined) $('#'+key).val(jsonConfig[key])
        }
        
        applyValue('ppv');
        applyValue('hpp');
        applyValue('qpp');
        applyValue('nservers');
        applyValue('notes');
        removePopulations();
        if(jsonConfig['demo_table']!=undefined && jsonConfig['demo_table'].length>0) {
            for(i=0;i<jsonConfig['demo_table'].length;i++) {
                data = jsonConfig['demo_table'][i];
                addPopulation( 
                    data['n_visits'], 
                    data['peak_time'], 
                    data['peak_percent']
                    );
            }
        }
        
        if(jsonConfig['cdn']!=undefined) {
            $('#slider_webserver').slider('value',jsonConfig['cdn']);
            updateCDNPercents();
            $('#useCDN').attr("checked",true);
            $('#cdn_setup').show();
        }else{
            $('#useCDN').attr("checked",false);
            $('#cdn_setup').hide();
        }
  }

  function removePopulations() {
        $('#demographic-data-table').innerHTML="";
        nrows=0;
  }

  function addPopulation(n_visits, peak_time, peak_percent) {
    if(n_visits==undefined) n_visits=0;
    if(peak_time==undefined) peak_time=8*60;
    if(peak_percent==undefined) peak_percent=0;

    peak_time_h = Math.floor(peak_time / 60);
    peak_time_m = peak_time % 60;

    $html = "<div class='demographic-data' id='demographic-data-row-"+nrows+"'> \
                <a href='javascript:$(\"#demographic-data-row-"+nrows+"\").remove()' class='button danger remove'>X</a> \
                <label>Visits</label> \
                <input type='text' name='n_visits_"+nrows+"' id='n_visits_"+nrows+"' value='"+n_visits+"' /> \
                <div style='float:left'> \
                    <label>Peak Time Start:</label> \
                    <input class='time-pick' type='text' size='2' \
                        name='peak_time_h_"+nrows+"' id='peak_time_h_"+nrows+"' value='"+peak_time_h+"' />: \
                    <input class='time-pick' type='text' size='2' \
                        name='peak_time_m_"+nrows+"' id='peak_time_m_"+nrows+"' value='"+peak_time_m+"' /> \
                </div> \
                <div style='float:right;text-align:right;'> \
                    <label>Percent Visits within Peak Hour:</label> \
                    <input type='text' size='2' \
                        name='peak_percent_"+nrows+"' id='peak_percent_"+nrows+"' value='"+peak_percent+"' />\
                </div> \
            </div>";
    $("#demographic-data-table").append($html);    
    nrows++;
  };

  function loadTab( tabID ) {
    var id = $('#tabs a[href="#'+tabID+'"]').parent().index()
    $("#tabs").tabs("option", "active", id)
  }
  
  function updateCDNPercents() {
    $('#slider_webserver_text')[0].innerHTML = $('#slider_webserver').slider('value') + '%';
    $('#slider_cdn_text')[0].innerHTML = 100-$('#slider_webserver').slider('value') + '%';
  }

  $(function() {
    //$.browser = {msie : (navigator.appName == 'Microsoft Internet Explorer')};
    
    //$.jqplot('chart',[[1,4,6,3,2,4,6,4,3,2]]);
    
    $( "#tabs" ).tabs();
    
    $( "#slider_webserver" ).slider( {
        slide: updateCDNPercents,
        change: updateCDNPercents,
        value: 100,
    });
    updateCDNPercents();
    
    $("#dialog-export").dialog(
        {
            position:'top',
            height: 'auto',
            width: 400,
            modal: true,
            buttons: {
              'ok': function() {
                $(this).dialog('close');
              }
            }
            
        }
    ).dialog('close')
    
    $("#dialog-import").dialog(
        {
            position:'top',
            height: 'auto',
            width: 400,
            modal: true,
            buttons: {
              'upload': function() {
                uploadJSON();
                $(this).dialog('close');
              },
              'cancel': function() {
                $(this).dialog('close');
              }
            }
            
        }
    ).dialog('close')
    
    
  });

  function dialogExport() {
     $("#dialog-export-textarea").val( JSON.stringify(readConfig()) );
     $("#dialog-export").dialog("open");
  }
  
  function dialogImport() {
     $("#dialog-import").dialog("open");
  }
  
  function uploadJSON() {
     importJSON( 
        $.parseJSON($("#dialog-import-textarea").val())
     );
  }
