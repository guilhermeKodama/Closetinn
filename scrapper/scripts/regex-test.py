import unidecode, json, re

text = "{'gender': 'masculino','pageName': 'Index','ET': 'cmspage','brandName':'','pageCategorySubcategoryBrand': '','pageType': '','skuTop3' : ['','',''],'wt_cc1':'','wt_cc2':'','wt_cc3':'','wt_cc4':'','wt_cc5':'','wt_cc6':'','keyword' : '','googleRemarketingLabel' : 'UWWxCIyIlAIQ5NyG1gM'}"
text = text.replace(' ','')
matches = re.findall(r'\'gender\':\'([a-z]*)\'', text)
print matches

# text = '<script sync type="text/javascript"> \n dataLayer = [\n{ \n \'pageName\': \'something\' \n}\n];  \n </script>'
# text = text.replace('\n','')
# text = text.replace('\r','')
# matches = re.findall(r'dataLayer\s\=\s\[(\{.+\})\]', text)
# print matches
