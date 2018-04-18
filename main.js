const TYPES = [
    {
        name: "mobile",
        value: 1
    },
    {
        name: "web",
        value: 2
    },
    {
        name: "qa",
        value: 10
    },
];

// Object which allow us to do some calculations
const Util = {
    getRandomNumber: function(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    },
    
    getRandomElement: function(arr) {
        const randIndex = Util.getRandomNumber(0, arr.length - 2); // 2 это черный хак, чтобы не использовать qa, так лучше не делать :)
        return arr[randIndex];
    },

    getElement: function(arr, condition) {
        const key = Object.keys(condition)[0]; // @TODOneedtoadd check if condition exist
        return arr.filter( (obj) => {
            return obj[key] === condition[key];
        })[0];
    }
};

class Project {
    constructor(complexity, type) {
        this.complex    = complexity || 0;
        this.type       = type || TYPES[0];
    }
};

class Employee {
    constructor(type) {
        this.type   = type || TYPES[0];
        this.idle   = 0;
    }
}

class Department {
    constructor(type) {
        this.employees  = []; // array of Employe instances
        this.projects   = []; // array of Project instances
        this.type       = type || TYPES[0];
    }

    setNewProject(project) {
        // проверяем если проект принадлежит нашему отделу, тогда будем с ним работать
        if(project.type.name === this.type.name) {
            this.projects.push(project);
            return true;
        } else {
            return false;
        }
    }

    hireEmploye() {
        // тут нужны условия хвтит ли текущих ресурсов для раелаизации этого проекта
        // если нет, то надо нанимать новых
        console.log('NEED TO HIRE AT ', this.type.name);
    }
}

class Director {
    constructor(name) {
        this.name           = name || "";
        this.projects       = []; // array of Project instances
        this.departments    = []; // array of Department instances
    }

    getProjects(howMany) {
        for (let i = 0; i < howMany; i++) {
            const type = Util.getRandomElement(TYPES); // get randomtype
            const complexity = Util.getRandomNumber(1, 3); // get random complexity
            const project = new Project(complexity, type);
            this.projects.push(project);
        }
    }

    addDeprtment(deprtment) {
        this.departments.push(deprtment);
    }

    sendProjectsToDepartaments() {
        let projects = [];
        this.departments.forEach((department) => {
            this.projects.forEach((project, index) => {       
                if (department.setNewProject(project)) {
                    // must remove from my end
                    projects = this.projects.slice(index, 1);
                    if(this.projects.length === 1) {
                        projects = [];
                    }
                }
            });
        });
       
        this.projects = projects;
    }

    _getDepartmentByType(type) {
        const result = this.departments.filter((department) => {
            return department.type.name === type.name;
        });
        if(result.length > 0) {
            return result[0];
        } else {
            return false;
        }
        
    }

    hire() {
        // если есть проекты в загашнике то необходимо дать команду отдела на найм сотрудников
        if(this.projects.length > 0) {
            // перебираме оставшиеся проекты и понимаем в какой отдеал надо нанимать
            this.projects.forEach((project) => {
                let departament = this._getDepartmentByType(project.type);
                if(departament) {
                    departament.hireEmploye(project);
                }
            });
        }
    }

};

/**------------- Основаня программа ------------------------- */
// Инициализируем экземпляр Диерктора
const ceo = new Director("Василий Иванович");
// create departments
['mobile', 'web', 'qa'].map((element) => {
    ceo.addDeprtment(new Department(Util.getElement(TYPES, {name: element})))
});

function startNewDay() {
    // получаем новые проекты
    ceo.getProjects(Util.getRandomNumber(1, 4));
    // распихиваем проекты по отделам
    // ceo.sendProjectsToDepartaments();

    ceo.hire();
}


// работаем один месяц
const days = 1;
for (let i = 0; i < days; i++) {
    startNewDay();
}

console.log(ceo);