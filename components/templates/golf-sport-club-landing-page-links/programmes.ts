export type EventKey = 'douala' | 'kribi'
export type Moment = { time: string; day: string; title: string; desc: string; tags: string[]; image: string }
export type Programme = { event: string; city: string; date: string; intro: string; moments: Moment[] }

export const PROGRAMMES: Record<EventKey, Programme> = {
  douala: {
    event: 'Golf Open Day',
    city: 'Douala',
    date: '10 avril 2027',
    intro: 'La matinée est consacrée à l’initiation et aux défis sur le green. Les participants retrouvent ensuite les partenaires d’Orange au déjeuner, avant la remise des prix.',
    moments: [
      { time: '08:00', day: 'Matinée', title: 'Initiation au golf', desc: 'Après l’accueil, prenez un club en main et essayez vos premiers coups avec les conseils des professionnels. Vous pouvez participer même si vous n’avez jamais joué. Le matériel est fourni sur place.', tags: ['Initiation', 'Matériel fourni', 'Tous niveaux'], image: '/au_programme/golf_rencontre.webp' },
      { time: '10:30', day: 'Matinée', title: 'Défis de golf', desc: 'Les ateliers vous font essayer trois gestes du golf. Le drive sert à envoyer la balle loin au départ, l’approche à la rapprocher du trou et le putting à la faire rouler sur le green. Tous les participants peuvent prendre part aux concours.', tags: ['Putting', 'Drive', 'Approche'], image: '/au_programme/golfeur.webp' },
      { time: '12:30', day: 'Après-midi', title: 'Déjeuner et rencontres', desc: 'Après les épreuves de la matinée, retrouvez à table les clients, partenaires et décideurs présents à Douala. Le déjeuner offre l’occasion de faire connaissance et d’échanger sur vos activités avant la remise des prix.', tags: ['Networking', 'Déjeuner', 'Partenaires'], image: '/au_programme/echange_pro.webp' },
      { time: '15:00', day: 'Après-midi', title: 'Remise des prix', desc: 'Rendez-vous à 15 h pour découvrir les résultats des défis de la matinée et applaudir les lauréats. Les participants se retrouvent ensuite pour une photo de groupe qui clôture le Golf Open Day.', tags: ['Remise des prix', 'Photo de groupe'], image: '/au_programme/classement.webp' },
    ],
  },
  kribi: {
    event: 'Orange Golf Experience',
    city: 'Kribi',
    date: '13 et 14 mars 2027',
    intro: 'Le tournoi et les concours se déroulent le premier jour au Kribi Golf & Country Club. Le lendemain, les dirigeants, clients et partenaires d’Orange Business se retrouvent au club-house.',
    moments: [
      { time: '09:00', day: 'Jour 1', title: 'Départ du scramble', desc: 'Après l’accueil et le briefing, les équipes prennent le départ sur le parcours en bord de mer. En scramble, chaque joueur frappe sa balle. L’équipe retient le coup qui la place le mieux, puis tous les joueurs repartent de cet endroit.', tags: ['Accueil', 'Briefing', 'Scramble'], image: '/au_programme/golf_rencontre.webp' },
      { time: '14:00', day: 'Jour 1', title: 'Compétition sur 18 trous', desc: 'Les équipes poursuivent le tournoi sur les 18 trous du Kribi Golf & Country Club. Trois concours complètent le parcours. La distance compte au drive, tandis que la précision fait la différence à l’approche et au putting.', tags: ['18 trous', 'Concours', 'Compétition'], image: '/au_programme/golfeur.webp' },
      { time: '10:00', day: 'Jour 2', title: 'Tables rondes au club-house', desc: 'Le deuxième jour, les dirigeants et partenaires d’Orange Business se retrouvent au club-house pour les tables rondes. Les échanges permettent de mieux connaître les activités des autres participants et de prolonger les discussions entamées sur le parcours.', tags: ['Tables rondes', 'Networking', 'Décideurs'], image: '/au_programme/echange_pro.webp' },
      { time: '17:00', day: 'Jour 2', title: 'Gala et remise des prix', desc: 'Les participants se retrouvent pour le dîner de gala à la fin de la deuxième journée. Le classement du tournoi y est annoncé et les équipes qui se sont distinguées sur le parcours reçoivent leurs prix.', tags: ['Dîner de gala', 'Remise des prix'], image: '/au_programme/classement.webp' },
    ],
  },
}
