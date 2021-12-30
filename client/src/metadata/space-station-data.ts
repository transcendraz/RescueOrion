import { SpaceStationMetadata } from './types';

const metadata: SpaceStationMetadata = {
  'andromeda': {
    location: 'andromeda',
    message: {
      asset: 'modals/Andromeda_Information_Card.jpg',
      note: "RESCUE RESOURCES AVAILABLE AT THIS STATION FOR PICKUP VIA STARWAY",
      technology: "Food Repair Team",
      title: 'Food Repair Team',
      paragraphs:[
        {text: 'The Food Repair Team is currently out on another mission and will not return to Andromeda until Day 14.'}
      ],
      sideNote: "available Day 14",
    }
  },
  'aquarius': {
    location: 't3',
    message: {
      asset: 'modals/Aquarius_Information_Card.jpg',
      note: "RESCUE RESOURCES AVAILABLE AT THIS STATION FOR PICKUP VIA STARWAY",
      technology: "Water Repair Team",
      title: 'Food at Orion',
      paragraphs: [
        {text: 'The food processing systems were destroyed at the time of the damage.'},
        {text: 'The emergency food reserves are running out and loss of life will begin on Day 24 unless they are fixed.'},
        {text: 'A Food Repair Team will become available at Andromeda.'},
      ],
    }
  },
  'borealis': {
    location: 't5',
    message: {
      asset: 'modals/Borealis_Information_Card.jpg',
      note: "RESCUE RESOURCES AVAILABLE AT THIS STATION FOR PICKUP VIA STARWAY",
      technology: "Oxygen Repair Team",
      title: 'O2 Repair at Orion',
      paragraphs: [
        {text: 'The 02 Repair Team can immediately and permanently restore 02 to ORION upon their arrival there.'},
        {text: 'However, they are unable to leave Borealis until AI technology from Capricorn comes to replace them.'},
        {text: 'Leaving with the O2 Repair Team prior to that will put all 200 scientists at Borealis at risk.'},
      ],
    }
  },
  'capricorn': {
    location: 't4',
    message: {
      asset: 'modals/Capricorn_Information_Card.jpg',
      note: "RESCUE RESOURCES AVAILABLE AT THIS STATION FOR PICKUP VIA STARWAY",
      technology: "AI Technology",
      title: 'Injuries at Orion',
      paragraphs: [
        {text: 'Three injuries were sustained at the time of the damage.'},
        {text: 'The injuries are getting progressively worse, and all three will die on Day 25 without advanced medical treatment.'},
        {text: 'The medical team is currently available at Cassiopeia.'},
      ]
    }
  },
  'cassiopeia': {
    location: 'cassiopeia',
    message: {
      asset: 'modals/Cassiopeia_Information_Card.jpg',
      note: "RESCUE RESOURCES AVAILABLE AT THIS STATION FOR PICKUP VIA STARWAY",
      technology: "Medical Repair Team",
      title: 'Water Provision at Orion',
      paragraphs: [
        {text: 'The water purification system shut down during the time of the damage.'},
        {text: 'There is enough reserved water to keep the scientists alive, but only until Day 23. Loss of life will begin unless the station’s water systems are permanently fixed.'},
        {text: 'A Water Repair Team is available at Aquarius.'},
      ]
    }
  },
  'orion': {
    location: 't2',
    message: {
      asset: 'modals/Orion_Information_Card.jpg',
      title: 'O2 at Orion',
      paragraphs: [
        {text: 'The scientists of Space Station Orion are quickly running out of oxygen.'},
        {text: 'The O2 replacement cells aboard your ship will temporarily solve the oxygen generation problem until Day 21.'},
        {text: 'Loss of life will begin again if a permanent oxygen generation solution isn’t installed by Day 21.'},
      ]
    }
  },
  'sagittarius': {
    location: 'sagittarius',
    message: {
      asset: 'modals/Sagittarius_Information_Card.jpg',
      title: 'Damage to Space Station Orion',
      paragraphs: [
        {text: 'Orion’s primary source of oxygen generation has been badly hit.'},
        {text: 'They only have 6 days of oxygen supply left before the loss of life begins.'},
        {text: 'Without repairs, oxygen generation will shut down completely in 21 days.'},
      ]
    }
  },
};

export default metadata;
