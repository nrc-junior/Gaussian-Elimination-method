const alphabet = ["A","B","C","D","E","F","G"];
const colors = ["#ff2b2b","#3fff2d","#0cb2c0","#ff17a3","#feff6e","#00aed9","#f38181"];
const step_list = document.getElementById("stepsList");

var matrix=[];
var etapas = [];

var htmlElements = []
var listElements = []
var needUpdate = false;

function GenMatrix(){
    needUpdate = true;
    if(htmlElements.length > 0){
        htmlElements.forEach(element => {
            element.remove();
        });
    }

    if(listElements.length > 0){
        listElements.forEach(element => {
            element.remove();
        });
    }

    var size = parseInt(document.getElementById('mtxsize').value);
    var useRandNum = document.getElementById('random_num').checked
    
    let MinMax = []
    
    size = size > 7 ? 7 : size < 2 ? 2 : size;

    if(useRandNum){
        MinMax[0] = parseFloat(document.getElementById('min_value_m').value)
        MinMax[1] = parseFloat(document.getElementById('max_value_m').value)
    }
    

    var matrixContainer = document.getElementById("matrix_div");
    for(let i = 0; i < size+2; i++){
        var variableName = document.createElement('DIV');
        
        if(i < size){
            variableName.innerHTML = `${alphabet[i]}`;
            variableName.style = `color: ${colors[i]}; text-align:center;`;
            variableName.classList.add('col');
        }else{
            variableName.innerHTML = '';
            variableName.classList.add('col');
            if(i > size){
                variableName.classList.remove('col');
                variableName.classList.add('w-100');
            }    
        }
        htmlElements.push(variableName);
        matrixContainer.appendChild(variableName);
    }


    for( let lin = 0; lin < size; lin++ ){
        for( let col = 0; col < size+1; col++ ){
            var colDiv = document.createElement('DIV');
                colDiv.classList.add('col')
            
            
            var inElement = document.createElement('INPUT');
                inElement.setAttribute('type',"number")
                inElement.setAttribute('placeholder', col >= size ? `ß${lin+1}`:`α${lin+1}${col+1}`) // é o B da linha?
                inElement.classList.add('w-100', 'form-control')
                inElement.setAttribute('id',`${lin}${col}`)
                inElement.setAttribute('required','true')
                inElement.setAttribute('disabled','true');
            
            if(useRandNum){
                rdm_n = Math.floor(Math.random() * (MinMax[1] - MinMax[0] + 1) + MinMax[0]);
                inElement.setAttribute('value',rdm_n);
            }
            
            colDiv.appendChild(inElement);
            matrixContainer.appendChild(colDiv)
            htmlElements.push(colDiv)

        }
        var rowDiv = document.createElement('DIV');
            rowDiv.classList.add('w-100')
        
        matrixContainer.appendChild(rowDiv)
        htmlElements.push(rowDiv)
    }

}

function GaussMethod() {
    if(!needUpdate){
        return;
    }
    etapas = [];
    matrix = [];
    needUpdate = false;

    if(listElements.length > 0){
        listElements.forEach(element => {
            element.remove();
        });
    }
    
    let stringStepMatrixList = [];
    var size = parseInt(document.getElementById('mtxsize').value);
    
    for (let i = 0; i < size; i++) {
        var row = [];

        for (let j = 0; j < size+1; j++) {
            const div = document.getElementById(`${i}${j}`);
            const v = parseFloat(div.value);
            if(v == NaN){
                ThrowError();
                return;
            }
            
            row.push({box: div, val:  parseFloat(div.value)});

            stringStepMatrixList.push(`${v}`); // salva etapa matriz inicial.
        }
        matrix.push(row);
    }
    etapas.push(stringStepMatrixList); //salva valores da matriz em uma etapa
    CreateStepIndex(0);

    var pCounter = 0;
    var rows = matrix.length;

    while(pCounter <  rows-1){
        let pivot = matrix[pCounter][pCounter].val;

        if(pivot == 0 ){
            let upperRow = matrix[pCounter];

            for (let r = pCounter+1; r < matrix.length; r++) { // encontra linha abaixo do pivo pra trocar.
                const adj = matrix[r][pCounter].val;
                if(adj != 0){
                    matrix[pCounter] = matrix[r];
                    matrix[r] = upperRow;
                    pivot = matrix[pCounter][pCounter].val;
                }
            }
        } 
        
        for(let m = pCounter+1; m<rows; m++){ // encontra multiplicador da linha do pivo.
            var multiplier =  matrix[m][pCounter].val/pivot;
            var cCounter = pCounter;

            while (cCounter < size+1) { // faz operação elemental no sistema. 
                matrix[m][cCounter].val = matrix[m][cCounter].val - (multiplier * matrix[pCounter][cCounter].val);
                cCounter++; 
            }
        }

        stringStepMatrixList = []

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size+1; j++) {
               const element_value = parseFloat(matrix[i][j].val).toFixed(4);
              
               stringStepMatrixList.push(`${(element_value - Math.floor(element_value)) !== 0 ? element_value : Math.floor(element_value)}`)
            }
        }
        etapas.push(stringStepMatrixList); //salva valores da matriz em uma etapa
        
        CreateStepIndex(pCounter+1);
        
        row = `\n iteração ${pCounter}\n`
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size+1; j++) {
                row +=  `${matrix[i][j].val}|`
            }
            row += '\n'
        }
        console.log(`subiu a etapa ${pCounter}: \n ${row}`);

        pCounter++;
    }

    var btnSistemaLinear = document.createElement('BUTTON');
        btnSistemaLinear.classList.add('btn','btn-sm', 'btn-outline-danger')
        btnSistemaLinear.setAttribute("type",'button')
        btnSistemaLinear.style = 'margin-left:5px';
        btnSistemaLinear.setAttribute("onclick",`SolveLS(); RenderPage(${size-1});`)
        btnSistemaLinear.innerHTML = 'Solução do Sistema'

    var li = document.createElement('li');
        li.classList.add('page-item')
        li.appendChild(btnSistemaLinear);
        
    listElements.push(li); 
    step_list.appendChild(li); 
}

function CreateStepIndex(index){
    var stepIndex = document.createElement('BUTTON');
        stepIndex.innerHTML = `${index}`;
        stepIndex.setAttribute("onclick",`RenderPage(${index});`);  
        stepIndex.classList.add('page-link');
    
    var li = document.createElement('li');
        li.classList.add('page-item')
        li.appendChild(stepIndex);

        listElements.push(li); 
        step_list.appendChild(li); 
}

function RenderPage(step) {
    const _step = etapas[step];
    let k = 0;
    for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if(i == step  && j == step){
                    matrix[i][j].box.style = "background-color:red;";  
                }else{
                    matrix[i][j].box.style = "background-color:default;";  
                }
                matrix[i][j].box.innerHTML = 'OPORRA';
                matrix[i][j].box.setAttribute("Value", _step[k++]);
            }
        }
}

function ThrowError(){
    const page = document.getElementById("main");
    var error = document.createElement('DIV');

    error.classList.add('alert','alert-danger');
    error.innerHTML = "Ocorreu um erro na solução dessa matriz!";
    error.setAttribute('role','alert');
    htmlElements.push(error);

    page.appendChild(error);

}

function SolveLS(){
    const bCol = matrix[0].length-1;
    var varValues = [];

    function sumCoeficients(coeficientPos, row, varValues){
        if(coeficientPos+1 >= bCol){
            console.log("retornou 0, coeficientPos+1 >= 0")
            return 0;
        }else{
            var sum = 0;
            var indexVariables = 0;
            while(++coeficientPos<bCol){
                console.log(`leu valor da coluna ${coeficientPos} da linha ${row} e o multiplicou por ${varValues[indexVariables]}`)
                sum = (parseFloat(matrix[row][coeficientPos].val) * varValues[indexVariables++]);
            }
            return sum;
        }
        ThrowError();
    }

    var iterations = 1;
    for (let row = matrix.length-1; row >= 0; row--) {
        var b = matrix[row][bCol].val;
        var coeficient = matrix[row][bCol-iterations].val;
        console.log(`resolvendo linha: ${row}, b = ${b}, coeficient e pos[${coeficient},${bCol-iterations}]`);

        var adjCoeficientSum = sumCoeficients(bCol-iterations, row, varValues)

        
        varValues.unshift((b - adjCoeficientSum ) / coeficient);

        iterations++;
    }

   // resultados:
    const page = document.getElementById("main");
    var resultDiv = document.createElement('DIV');
    var indX = 0;
    
    resultDiv.style = "padding-left:20px;";
    htmlElements.push(resultDiv);
    
    varValues.forEach(result => {
        var varIdentifier = document.createElement('SPAN');
        var result = document.createElement('SPAN');
        result.innerHTML = `${varValues[indX].toFixed(4)}${indX+1<varValues.length?',':'.'} `;
        result.style = "color:white; "
        
        varIdentifier.innerHTML = `${alphabet[indX]}: `;
        varIdentifier.style = `color: ${colors[indX]}; padding-left:20px;`
        varIdentifier.appendChild(result);
        
        htmlElements.push(varIdentifier);
        resultDiv.appendChild(varIdentifier);
        indX++;
    });
    page.appendChild(resultDiv);
}