import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';

function HomePage(props) {
 return (
   <Fragment>
     <Head>
       <title>Meetup Tutorial</title>
       <meta name="description" content="blah blah blah blah blah"/>
     </Head>
     <MeetupList meetups={props.meetups} />
   </Fragment>

 )
}

// export async function getServerSideProps(context) {
//   // rebuilds the page for EVERY request
//  // ONLY use if you need data from req or have data that changes several times per second

//   // fetch data from api
//   const req = context.req;
//   const res = context.res;
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   };
// }


export async function getStaticProps() {
  // fetch data from api
  
  const client = await MongoClient.connect('mongodb+srv://powrbrent:77rYhq7XZ8Ww@cluster0.xo9r7.mongodb.net/meetups?retryWrites=true&w=majority');

  const db = client.db();

  const meetupsCollection = db.collection('meetups');
  
  const meetups = await meetupsCollection.find().toArray(); // by default, find will return ALL

  client.close();
  // This only runs in buiild cycle, not on client's computer
  // must return an object
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    }, 
    revalidate: 10 // will make page rebuild every X seconds after deploy
  }
}

export default HomePage;  