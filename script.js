/* ==========================================================
   GESTIONNAIRE DE TÂCHES
   SCRIPT JAVASCRIPT MODERNE
   Mini-Projet JavaScript - Prépa MN1

   Fonctionnalités :
   - CRUD complet
   - LocalStorage
   - Recherche
   - Filtres
   - Mode sombre
   - Statistiques dynamiques
   - Barre de progression
   - Animations
   ========================================================== */


/* ==========================================================
   1. VARIABLES GLOBALES
   ========================================================== */


let taches = [];

let prochainId = 1;

let filtreActif = "toutes";



/* ==========================================================
   2. RÉCUPÉRATION DES ÉLÉMENTS HTML
   ========================================================== */


const taskForm = document.getElementById("taskForm");

const taskNameInput =
document.getElementById("taskName");

const taskDescriptionInput =
document.getElementById("taskDescription");

const taskPrioritySelect =
document.getElementById("taskPriority");


const taskList =
document.getElementById("taskList");


const emptyMessage =
document.getElementById("emptyMessage");


const searchInput =
document.getElementById("searchInput");


const filterButtons =
document.querySelectorAll(".filter-btn");


const darkModeToggle =
document.getElementById("darkModeToggle");



/* Statistiques */

const statTotal =
document.getElementById("statTotal");


const statDone =
document.getElementById("statDone");


const statTodo =
document.getElementById("statTodo");



/* Progression */

const progressBar =
document.getElementById("progressBar");


const progressText =
document.getElementById("progressText");





/* ==========================================================
   3. LOCAL STORAGE
   ========================================================== */


/**
 * Sauvegarde toutes les données dans le navigateur.
 */
function sauvegarderDonnees(){

    localStorage.setItem(
        "taches",
        JSON.stringify(taches)
    );


    localStorage.setItem(
        "prochainId",
        prochainId
    );

}



/**
 * Recharge les données sauvegardées.
 */
function chargerDonnees(){


    const sauvegarde =
    localStorage.getItem("taches");


    const idSauvegarde =
    localStorage.getItem("prochainId");



    if(sauvegarde){

        taches =
        JSON.parse(sauvegarde);

    }



    if(idSauvegarde){

        prochainId =
        Number(idSauvegarde);

    }


}




/* ==========================================================
   4. CRÉATION DES TÂCHES
   ========================================================== */


/**
 * Ajoute une nouvelle tâche dans le tableau.
 */
function ajouterTache(
    nom,
    description,
    priorite
){


    const nouvelleTache = {


        id: prochainId,


        nom: nom.trim(),


        description:
        description.trim(),


        priorite,


        statut:"a-faire",


        dateCreation:
        new Date()
        .toLocaleDateString("fr-FR")


    };



    taches.push(nouvelleTache);



    prochainId++;



    sauvegarderDonnees();



    actualiserApplication();



    afficherNotification(
        "Tâche ajoutée avec succès ✅"
    );


}





/**
 * Supprime une tâche.
 */
function supprimerTache(id){


    taches =
    taches.filter(
        tache =>
        tache.id !== id
    );



    sauvegarderDonnees();



    actualiserApplication();



    afficherNotification(
        "Tâche supprimée 🗑️"
    );


}





/**
 * Change le statut d'une tâche.
 */
function changerStatut(id){


    const tache =
    taches.find(
        element =>
        element.id === id
    );



    if(!tache)
        return;



    tache.statut =
    tache.statut === "a-faire"
    ?
    "terminee"
    :
    "a-faire";



    sauvegarderDonnees();



    actualiserApplication();



    afficherNotification(
        tache.statut === "terminee"
        ?
        "Tâche terminée 🎉"
        :
        "Tâche remise à faire"
    );


}

/* ==========================================================
   5. AFFICHAGE DYNAMIQUE DES TÂCHES
   ========================================================== */


/**
 * Retourne la liste des tâches visibles
 * selon :
 * - le filtre actif
 * - la recherche
 */
function obtenirTachesAffichees(){


    let resultat = [...taches];



    // Filtrage par statut

    if(filtreActif === "a-faire"){

        resultat =
        resultat.filter(
            tache =>
            tache.statut === "a-faire"
        );

    }



    if(filtreActif === "terminee"){

        resultat =
        resultat.filter(
            tache =>
            tache.statut === "terminee"
        );

    }




    // Recherche texte

    const recherche =
    searchInput.value
    .trim()
    .toLowerCase();



    if(recherche){

        resultat =
        resultat.filter(
            tache =>
            tache.nom
            .toLowerCase()
            .includes(recherche)
        );

    }



    return resultat;

}





/**
 * Transforme une priorité interne
 * en texte visible.
 */
function afficherPriorite(priorite){


    const priorites = {

        haute:"🔴 Haute",

        moyenne:"🟡 Moyenne",

        basse:"🟢 Faible"

    };


    return priorites[priorite]
    || priorite;

}





/**
 * Création du HTML d'une tâche.
 */
function creerCarteTache(
    tache,
    index
){


    const terminee =
    tache.statut === "terminee";



    return `

    <li class="task-item 
    priorite-${tache.priorite}
    ${terminee ? "tache-terminee" : ""}">


        <div class="task-main">


            <div class="task-index">

                ${index + 1}

            </div>



            <div class="task-content">


                <h3 class="task-name">

                    ${securiserTexte(tache.nom)}

                </h3>



                ${
                    tache.description
                    ?
                    `
                    <p class="task-description">

                        ${securiserTexte(tache.description)}

                    </p>
                    `
                    :
                    ""
                }




                <div class="task-meta">


                    <span class="badge badge-priorite">

                        ${afficherPriorite(
                            tache.priorite
                        )}

                    </span>




                    <span class="badge 
                    ${terminee 
                    ? 
                    "badge-terminee"
                    :
                    "badge-a-faire"}">

                        ${
                        terminee
                        ?
                        "✅ Terminée"
                        :
                        "⏳ À faire"
                        }

                    </span>




                    <span class="task-date">

                        📅 ${tache.dateCreation}

                    </span>


                </div>


            </div>


        </div>





        <div class="task-actions">


            <button
            class="btn-action btn-toggle"
            data-id="${tache.id}">


                ${
                terminee
                ?
                "↩ Reprendre"
                :
                "✔ Terminer"
                }


            </button>




            <button
            class="btn-action btn-delete"
            data-delete="${tache.id}">


                🗑 Supprimer


            </button>


        </div>



    </li>


    `;


}






/**
 * Affiche toutes les tâches filtrées.
 */
function afficherTaches(){


    const liste =
    obtenirTachesAffichees();



    taskList.innerHTML = "";




    if(liste.length === 0){


        emptyMessage.style.display =
        "block";


        return;

    }



    emptyMessage.style.display =
    "none";




    liste.forEach(
        (tache,index)=>{


            taskList.innerHTML +=
            creerCarteTache(
                tache,
                index
            );


        }
    );



}





/* ==========================================================
   6. RECHERCHE ET FILTRES
   ========================================================== */


searchInput.addEventListener(
"input",
()=>{

    afficherTaches();

});






filterButtons.forEach(
bouton=>{


    bouton.addEventListener(
    "click",
    ()=>{


        filterButtons
        .forEach(
            btn =>
            btn.classList.remove(
                "active"
            )
        );



        bouton.classList.add(
            "active"
        );



        filtreActif =
        bouton.dataset.filter;



        afficherTaches();


    });


});







/* ==========================================================
   7. ACTIONS SUR LES TÂCHES
   ========================================================== */


taskList.addEventListener(
"click",
(event)=>{


    const boutonStatut =
    event.target.closest(
        ".btn-toggle"
    );



    const boutonSuppression =
    event.target.closest(
        ".btn-delete"
    );





    if(boutonStatut){


        changerStatut(
            Number(
                boutonStatut.dataset.id
            )
        );


    }






    if(boutonSuppression){


        supprimerTache(
            Number(
                boutonSuppression.dataset.delete
            )
        );


    }



});

/* ==========================================================
   8. STATISTIQUES ET PROGRESSION
   ========================================================== */


/**
 * Met à jour les compteurs du tableau de bord.
 */
function mettreAJourStatistiques(){


    const total =
    taches.length;



    const terminees =
    taches.filter(
        tache =>
        tache.statut === "terminee"
    ).length;



    const restantes =
    total - terminees;




    animerNombre(
        statTotal,
        total
    );



    animerNombre(
        statDone,
        terminees
    );



    animerNombre(
        statTodo,
        restantes
    );



    mettreAJourProgression(
        total,
        terminees
    );


}






/**
 * Animation des nombres
 * dans les cartes statistiques.
 */
function animerNombre(
    element,
    valeurFinale
){


    const valeurDepart =
    Number(element.textContent);



    if(valeurDepart === valeurFinale)
        return;




    const difference =
    valeurFinale - valeurDepart;



    const duree = 400;



    let depart = null;




    function animation(
        temps
    ){


        if(!depart)
            depart = temps;



        const progression =
        Math.min(
            (temps - depart)
            /
            duree,
            1
        );



        const valeur =
        Math.floor(
            valeurDepart
            +
            difference
            *
            progression
        );



        element.textContent =
        valeur;



        if(progression < 1){

            requestAnimationFrame(
                animation
            );

        }


    }



    requestAnimationFrame(
        animation
    );


}







/**
 * Met à jour la barre de progression.
 */
function mettreAJourProgression(
    total,
    terminees
){



    let pourcentage = 0;



    if(total > 0){

        pourcentage =
        Math.round(
            (terminees / total)
            *
            100
        );

    }





    progressBar.style.width =
    pourcentage + "%";



    progressText.textContent =
    pourcentage + "%";


}









/* ==========================================================
   9. MODE SOMBRE
   ========================================================== */


/**
 * Active ou désactive le thème sombre.
 */
function changerModeSombre(){



    document.body
    .classList
    .toggle(
        "dark-mode"
    );



    const sombre =
    document.body
    .classList
    .contains(
        "dark-mode"
    );



    localStorage.setItem(
        "modeSombre",
        sombre
    );



    darkModeToggle.textContent =
    sombre
    ?
    "☀️"
    :
    "🌙";


}






/**
 * Recharge le thème choisi
 * par l'utilisateur.
 */
function chargerModeSombre(){



    const sombre =
    localStorage.getItem(
        "modeSombre"
    );



    if(sombre === "true"){


        document.body
        .classList
        .add(
            "dark-mode"
        );


        darkModeToggle.textContent =
        "☀️";


    }


}




darkModeToggle.addEventListener(
"click",
changerModeSombre
);








/* ==========================================================
   10. NOTIFICATIONS
   ========================================================== */


/**
 * Affiche un message temporaire.
 */
function afficherNotification(
    message
){



    const notification =
    document.createElement(
        "div"
    );



    notification.className =
    "notification";



    notification.textContent =
    message;




    document.body.appendChild(
        notification
    );




    setTimeout(
        ()=>{

            notification.classList.add(
                "show"
            );

        },
        10
    );




    setTimeout(
        ()=>{


            notification.classList.remove(
                "show"
            );



            setTimeout(
                ()=>{

                    notification.remove();

                },
                300
            );



        },
        2500
    );



}






/* ==========================================================
   11. AJOUT DE TÂCHE VIA FORMULAIRE
   ========================================================== */



taskForm.addEventListener(
"submit",
(event)=>{


    event.preventDefault();



    const nom =
    taskNameInput.value.trim();



    const description =
    taskDescriptionInput.value;



    const priorite =
    taskPrioritySelect.value;





    if(!nom){


        afficherNotification(
            "⚠️ Le nom est obligatoire"
        );


        return;


    }




    ajouterTache(
        nom,
        description,
        priorite
    );




    taskForm.reset();



    taskNameInput.focus();



});








/* ==========================================================
   12. RAFRAÎCHISSEMENT GLOBAL
   ========================================================== */


/**
 * Actualise toute l'application.
 */
function actualiserApplication(){


    afficherTaches();


    mettreAJourStatistiques();


}

/* ==========================================================
   13. SÉCURISATION DU TEXTE
   ========================================================== */


/**
 * Protège l'application contre l'injection HTML.
 * Les textes saisis par l'utilisateur sont nettoyés
 * avant affichage.
 */
function securiserTexte(texte){


    const element =
    document.createElement(
        "div"
    );


    element.textContent =
    texte;


    return element.innerHTML;

}





/* ==========================================================
   14. STYLE DES NOTIFICATIONS
   Créé directement par JavaScript
   ========================================================== */


function ajouterStyleNotification(){


    const style =
    document.createElement(
        "style"
    );


    style.textContent = `


    .notification{

        position:fixed;

        top:25px;

        right:25px;

        background:

        linear-gradient(
        135deg,
        #2563EB,
        #4F46E5
        );

        color:white;

        padding:16px 22px;

        border-radius:15px;

        font-weight:600;

        box-shadow:
        0 15px 35px rgba(0,0,0,.25);

        transform:
        translateX(120%);

        opacity:0;

        transition:.35s ease;

        z-index:9999;

    }



    .notification.show{

        transform:
        translateX(0);

        opacity:1;

    }



    `;


    document.head.appendChild(
        style
    );

}





/* ==========================================================
   15. INITIALISATION APPLICATION
   ========================================================== */


function initialiserApplication(){



    chargerDonnees();



    chargerModeSombre();



    ajouterStyleNotification();



    actualiserApplication();





}




/* ==========================================================
   16. LANCEMENT
   ========================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


    initialiserApplication();


});

