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
        
        if($('[id^=demo_table_row_]').length>0) {
            config.demo_table = new Array();
            
            $.each($('[id^=demo_table_row_]'), function(i,v) { 
                nid = ( $(v).attr('id').match(/(demo_table_row_)([0-9]*)/)[2] );
                
                config.demo_table.push ({
                    "n_visits":$("#n_visits_"+nid).attr('value'),
                    "peak_time_h":$("#peak_time_h_"+nid).attr('value'),
                    "peak_time_m":$("#peak_time_m_"+nid).attr('value'),
                    "peak_duration_h_":$("#peak_duration_h_"+nid).attr('value'),
                    "peak_duration_h_":$("#peak_duration_m_"+nid).attr('value'),
                });
                
            });
        }
        
        if($('#useCDN').is(':checked')) {
            config.cdn = $('#slider_webserver').slider('value');
        }
        
        return config;
  }

  function loadConfigFile(jsonConfig) {
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
                    data['peak_time_h'], 
                    data['peak_time_m'], 
                    data['peak_duration_h'], 
                    data['peak_duration_m']);
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
        $('#demo_table').find("tr:gt(0)").remove();
  }

  var nrows=0;
  function addPopulation(n_visits, peak_time_h, peak_time_m, peak_duration_h, peak_duration_m) {
    if(n_visits==undefined) n_visits=0;
    if(peak_time_h==undefined) peak_time_h=12;
    if(peak_time_m==undefined) peak_time_m=0;
    if(peak_duration_h==undefined) peak_duration_h=4;
    if(peak_duration_m==undefined) peak_duration_m=0;
  
    $('#demo_table').append("<tr id='demo_table_row_"+nrows+"'><td>"+
        "<input type='text' name='n_visits_"+nrows+"' id='n_visits_"+nrows+"' value="+n_visits+" /></td><td>"+
        "<input type='text' size='2' name='peak_time_h_"+nrows+"' id='peak_time_h_"+nrows+"' value="+peak_time_h+" />:"+
        "<input type='text' size='2' name='peak_time_m_"+nrows+"' id='peak_time_m_"+nrows+"' value="+peak_time_m+" />"+
        "</td><td>"+
        "<input type='text' size='2' name='peak_duration_h_"+nrows+"' id='peak_duration_h_"+nrows+"' value="+peak_duration_h+" />:"+
        "<input type='text' size='2' name='peak_duration_m_"+nrows+"' id='peak_duration_m_"+nrows+"' value="+peak_duration_m+" />"+
        "</td><td style='width:32px'>"+
        "<a href='javascript:$(\"#demo_table_row_"+nrows+"\").remove()'>[x]</a>"+
        "</td></tr>");
    nrows++;
  };

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
  });
