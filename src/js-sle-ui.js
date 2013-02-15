/*
{"ppv":"ppv","hpp":"hpp","qpp":"queries","nservers":"nweb","demo_table":[{"n_visits":"visits","peak_start_h":"h0","peak_start_m":"m0","peak_end_h":"h1","peak_end_m":"m1"}],"cdn":27}
*/

  var nrows=0;
  
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
        };
        
        var demoItems = $('#demographic-data-table').children();
        if( demoItems.length > 0 ) {
            config.demo_table = new Array();
            $.each( demoItems, function(i,v) {
                nid = ( $(v).attr('id').match(/(demographic-data-row-)([0-9]*)/)[2] );
                console.log(nid);
                config.demo_table.push ({
                    "n_visits":$("#n_visits_"+nid).val(),
                    "peak_start_h":$("#peak_start_h_"+nid).val(),
                    "peak_start_m":$("#peak_start_m_"+nid).val(),
                    "peak_end_h":$("#peak_end_h_"+nid).val(),
                    "peak_end_m":$("#peak_end_m_"+nid).val(),
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
        
        removePopulations();
        if(jsonConfig['demo_table']!=undefined && jsonConfig['demo_table'].length>0) {
            for(i=0;i<jsonConfig['demo_table'].length;i++) {
                data = jsonConfig['demo_table'][i];
                addPopulation( 
                    data['n_visits'], 
                    data['peak_start_h'], 
                    data['peak_start_m'], 
                    data['peak_end_h'], 
                    data['peak_end_m']);
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

  function addPopulation(n_visits, peak_start_h, peak_start_m, peak_end_h, peak_end_m) {
    if(n_visits==undefined) n_visits=0;
    if(peak_start_h==undefined) peak_start_h=8;
    if(peak_start_m==undefined) peak_start_m=0;
    if(peak_end_h==undefined) peak_end_h=16;
    if(peak_end_m==undefined) peak_end_m=0;
        
    $html = "<div class='demographic-data' id='demographic-data-row-"+nrows+"'> \
                <a href='javascript:$(\"#demographic-data-row-"+nrows+"\").remove()' class='button danger remove'>X</a> \
                <label>Visits</label> \
                <input type='text' name='n_visits_"+nrows+"' id='n_visits_"+nrows+"' value='"+n_visits+"' /> \
                <div style='float:left'> \
                    <label>Peak Time Start:</label> \
                    <input class='time-pick' type='text' size='2' \
                        name='peak_start_h_"+nrows+"' id='peak_start_h_"+nrows+"' value='"+peak_start_h+"' />: \
                    <input class='time-pick' type='text' size='2' \
                        name='peak_start_m_"+nrows+"' id='peak_start_m_"+nrows+"' value='"+peak_start_m+"' /> \
                </div> \
                <div style='float:right;text-align:right;'> \
                    <label>Peak Time End:</label> \
                    <input class='time-pick' type='text' size='2' \
                        name='peak_end_h_"+nrows+"' id='peak_end_h_"+nrows+"' value='"+peak_end_h+"' />:\
                    <input class='time-pick' type='text' size='2' \
                        name='peak_end_m_"+nrows+"' id='peak_end_m_"+nrows+"' value='"+peak_end_m+"' /> \
                </div>                                                                                                  \
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
    $( "#tabs" ).tabs();
    
    $( "#slider_webserver" ).slider( {
        slide: updateCDNPercents,
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
