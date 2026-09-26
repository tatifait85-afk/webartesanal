/* ============================================
   BUFETE JMC Y ASOCIADOS — abogados.js
   Fuente única de los 3 profesionales.
   La formación y los años de experiencia son
   contenido ficticio creado para esta demo.
   ========================================================== */

var ABOGADOS = [
  {
    id: 'ramiro-cardenas',
    nombre: 'Lic. Ramiro Cárdenas',
    area: 'Derecho Laboral',
    imagen: 'assets/img/ramiro.webp',
    intro: 'Asesoría y representación legal en materia laboral, para proteger sus derechos y resolver conflictos de forma justa y efectiva.',
    servicios: [
      'Contratos de trabajo',
      'Relaciones laborales',
      'Despidos y prestaciones',
      'Reclamos laborales',
      'Conciliación y mediación',
      'Asesoría para empresas y trabajadores'
    ],
    frase: 'El trabajo es un derecho, y su protección construye mejores oportunidades.',
    formacion: 'Licenciado en Derecho, Universidad de Costa Rica.',
    experiencia: 'Más de 12 años de experiencia en Derecho Laboral.',
    colegiado: 'Miembro activo del Colegio de Abogados y Abogadas de Costa Rica.',
    bio: 'Ramiro ha acompañado tanto a empresas como a trabajadores en procesos laborales, buscando siempre soluciones justas y efectivas. Su enfoque combina firmeza técnica con un trato cercano hacia cada persona que representa.'
  },
  {
    id: 'vanessa-washington',
    nombre: 'Licda. Vanessa Washington',
    area: 'Derecho de Familia',
    imagen: 'assets/img/vanessa.webp',
    intro: 'Acompañamiento legal en las decisiones más importantes de su vida familiar, con empatía, claridad y compromiso.',
    servicios: [
      'Divorcio y separación',
      'Pensiones alimentarias',
      'Guarda y crianza',
      'Régimen de visitas',
      'Procesos familiares',
      'Orientación en acuerdos y mediación'
    ],
    frase: 'Cada familia es única, y merece ser escuchada.',
    formacion: 'Licenciada en Derecho, Universidad Latina de Costa Rica.',
    experiencia: 'Más de 8 años de experiencia en Derecho de Familia y mediación.',
    colegiado: 'Miembro activa del Colegio de Abogados y Abogadas de Costa Rica.',
    bio: 'Vanessa acompaña a familias en algunos de los momentos más sensibles de su vida legal. Su enfoque prioriza la escucha, la claridad en cada paso del proceso, y la búsqueda de acuerdos que protejan el bienestar de todas las partes, especialmente el de los menores de edad.'
  },
  {
    id: 'marlene-hidalgo',
    nombre: 'Licda. Marlene Hidalgo',
    area: 'Derecho Penal',
    imagen: 'assets/img/marlene.webp',
    intro: 'Defensa y representación legal en las diferentes etapas del proceso penal, con estrategia, compromiso y confidencialidad.',
    servicios: [
      'Asesoría en investigaciones',
      'Defensa en procesos penales',
      'Acompañamiento en audiencias',
      'Medidas cautelares',
      'Atención de denuncias y acusaciones',
      'Orientación legal especializada'
    ],
    frase: 'Cada caso es una historia, y cada persona merece ser escuchada.',
    formacion: 'Licenciada en Derecho, Universidad de Costa Rica.',
    experiencia: 'Más de 10 años de experiencia en Derecho Penal y Procesal Penal.',
    colegiado: 'Miembro activa del Colegio de Abogados y Abogadas de Costa Rica.',
    bio: 'Marlene ha construido su trayectoria en la defensa penal con un enfoque estratégico y una atención cercana a cada cliente. Entiende que enfrentar un proceso penal es una de las experiencias más difíciles en la vida de una persona, y acompaña cada caso con confidencialidad y compromiso.'
  }
];

function buscarAbogadoPorId(id) {
  return ABOGADOS.find(function (a) { return a.id === id; });
}
