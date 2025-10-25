import { useEffect, useState } from 'react';
import PublicListings from './PublicListings.jsx';
import SubmitListing from './SubmitListing.jsx';
export default function App(){const [route,setRoute]=useState(window.location.hash||'#/');useEffect(()=>{const on=()=>setRoute(window.location.hash||'#/');window.addEventListener('hashchange',on);return()=>window.removeEventListener('hashchange',on);},[]);if(route.startsWith('#/submit'))return <SubmitListing/>;return <PublicListings/>;}
