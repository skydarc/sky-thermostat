export function css(user) {
    var css =`
    
    
            .content {
                display: flex;
                flex-direction: column;
                gap: 20px;
                padding: 20px 0px;
            }
            
            .col{
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
              
            .row{
                position: relative;
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 10px;
            }
            
            .inner {
                padding: 10px 5px;
            }
            
            .cell{
                flex: 1; 
            }
            

            
  `
    return css;

}
  
