import {v4 as uuid} from 'uuid';

const noteOptions = [
    <option key={uuid()+'note'} value='C'>C</option>,
    <option key={uuid()+'note'} value='C#'>C#/Db</option>,
    <option key={uuid()+'note'} value='D'>D</option>,
    <option key={uuid()+'note'} value='D#'>D#/Eb</option>,
    <option key={uuid()+'note'} value='E'>E</option>,
    <option key={uuid()+'note'} value='F'>F</option>,
    <option key={uuid()+'note'} value='G'>G</option>,
    <option key={uuid()+'note'} value='G#'>G#/Ab</option>,
    <option key={uuid()+'note'} value='A'>A</option>,
    <option key={uuid()+'note'} value='A#'>A#/Bb</option>,
    <option key={uuid()+'note'} value='B'>B</option>,
];

export default noteOptions;