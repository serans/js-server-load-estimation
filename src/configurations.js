configurations = 
{ 
  
  default_config: {  
    "description": "",
    "demo_table": 
        [{
            "n_visits":0,
            "peak_time_h":12,
            "peak_time_m":0,
            "peak_duration_h":4,
            "peak_duration_m":0,
        }],
    "ppv":1,
    "hpp":1,
    "qpp":1,
    "nservers":1,
},

  drupal_blog : { 
    "description": "Blog created using the Drupal CMS",
    "demo_table":
        [{
            "n_visits":1000,
            "peak_time_h":12,
            "peak_time_m":0,
            "peak_duration_h":4,
            "peak_duration_m":0,
        },
        {
            "n_visits":690,
            "peak_time_h":23,
            "peak_time_m":30,
            "peak_duration_h":3,
            "peak_duration_m":30,
        }],
    "ppv":1,
    "hpp":1,
    "qpp":1,
    "nservers":1,
    "cdn":85,
}};
