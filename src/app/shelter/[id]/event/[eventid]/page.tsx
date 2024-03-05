import { get } from '@/api/shelter/event/volunteer-event';
import VolunteerEventPage from '@/components/shelter-event/VolunteerEventPage/VolunteerEventPage';
import { Metadata } from 'next';

export interface EventPageProps {
  params: {
    id: string;
    eventid: string;
  };
}

interface Props extends EventPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await get(Number(params.id), Number(params.eventid));
  return {
    title: data.shelterName,
    description: data.title
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id: shelterId, eventid: volunteerEventId } = params;

  return (
    <VolunteerEventPage
      shelterId={+shelterId}
      volunteerEventId={+volunteerEventId}
    />
  );
}
