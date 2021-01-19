$(document).ready(function() {
    document.querySelector('input[type=radio][name=tip]').checked=true;
    document.querySelector('input[type=radio][name=podtip]').checked=true;
    document.querySelector(".mirisi").style.display='block';
    document.querySelector(".negatela").style.display='none';
    document.querySelector(".negakose").style.display='none';
    document.querySelector(".negalica").style.display='none';
    document.querySelector(".sminka").style.display='none';
    document.querySelectorAll('.zene').forEach((el)=>{
        el.style.display='none';
    })
    document.querySelectorAll('.deca').forEach((el)=>{
        el.style.display='none';
    }) 
       document.querySelectorAll('.muskarci').forEach((el)=>{
        el.style.display='block';
    })
    $('input[type=radio][name=kategorija]').on('change', function() {
        document.querySelector('input[type=radio][name=tip]').checked=true;
        document.querySelector('input[type=radio][name=podtip]').checked=true;
        if($(this).val()=='Muskarci')
        {
        
            document.querySelectorAll('.zene').forEach((el)=>{
                el.style.display='none';
            })
            document.querySelectorAll('.deca').forEach((el)=>{
                el.style.display='none';
            }) 
               document.querySelectorAll('.muskarci').forEach((el)=>{
                el.style.display='block';
            })
            document.querySelector(".mirisi").style.display='block';
            document.querySelector(".negatela").style.display='none';
            document.querySelector(".negakose").style.display='none';
            document.querySelector(".negalica").style.display='none';
            document.querySelector(".sminka").style.display='none';
        }
        else   if($(this).val()=='Zene')
        {
           
            document.querySelectorAll('.muskarci').forEach((el)=>{
                el.style.display='none';
            })
            document.querySelectorAll('.deca').forEach((el)=>{
                el.style.display='none';
            }) 
            document.querySelectorAll('.zene').forEach((el)=>{
                el.style.display='block';
            })
            document.querySelector(".mirisi").style.display='block';
            document.querySelector(".negatela").style.display='none';
            document.querySelector(".negakose").style.display='none';
            document.querySelector(".negalica").style.display='none';
            document.querySelector(".sminka").style.display='none';
        }
        else
        {
            
            document.querySelectorAll('.zene').forEach((el)=>{
                el.style.display='none';
            })
            document.querySelectorAll('.muskarci').forEach((el)=>{
                el.style.display='none';
            })
            document.querySelectorAll('.deca').forEach((el)=>{
                el.style.display='block';
            })
            document.querySelector(".mirisi").style.display='block';
            document.querySelector(".negatela").style.display='none';
            document.querySelector(".negakose").style.display='none';
            document.querySelector(".negalica").style.display='none';
            document.querySelector(".sminka").style.display='none';
        }
    })
    $('input[type=radio][name=tip]').on('change', function() {
        console.log('cao');
        switch($(this).val()){
        case 'Mirisi':
        {
            document.querySelectorAll('input[type=radio][name=podtip]')[0].checked=true;
            document.querySelector(".mirisi").style.display='block';
            document.querySelector(".negatela").style.display='none';
            document.querySelector(".negakose").style.display='none';
            document.querySelector(".negalica").style.display='none';
            document.querySelector(".sminka").style.display='none';

            break;
        }
        case 'Nega tela':{
            document.querySelectorAll('input[type=radio][name=podtip]')[5].checked=true;
            document.querySelector(".mirisi").style.display='none';
            document.querySelector(".negatela").style.display='block';
            document.querySelector(".negakose").style.display='none';
            document.querySelector(".negalica").style.display='none';
            document.querySelector(".sminka").style.display='none';
            break;

        }
        case 'Nega lica':{
            document.querySelectorAll('input[type=radio][name=podtip]')[17].checked=true;

            document.querySelector(".mirisi").style.display='none';
            document.querySelector(".negatela").style.display='none';
            document.querySelector(".negakose").style.display='none';
            document.querySelector(".negalica").style.display='block';
            document.querySelector(".sminka").style.display='none';
            break;

        }
        case 'Nega kose':{
            document.querySelectorAll('input[type=radio][name=podtip]')[12].checked=true;

            document.querySelector(".mirisi").style.display='none';
            document.querySelector(".negatela").style.display='none';
            document.querySelector(".negakose").style.display='block';
            document.querySelector(".negalica").style.display='none';
            document.querySelector(".sminka").style.display='none';
            break;

        }
        case 'Sminka':{
            document.querySelectorAll('input[type=radio][name=podtip]')[23].checked=true;

            document.querySelector(".mirisi").style.display='none';
            document.querySelector(".negatela").style.display='none';
            document.querySelector(".negakose").style.display='none';
            document.querySelector(".negalica").style.display='none';
            document.querySelector(".sminka").style.display='block';
            break;

        }
    }
    });
})