import { AdvancedVideo } from "@cloudinary/react";
import type { CloudinaryVideo } from '@cloudinary/url-gen';

type ContentCardProps = {
    color: string;
    cldVideo?: CloudinaryVideo;
}

export default function ContentCard({ color, cldVideo }: ContentCardProps) {
    return (
        <div className={`aspect-video w-full bg-${color} rounded-xl`}>
            {cldVideo && (
                <AdvancedVideo cldVid={cldVideo} autoPlay loop muted controls={false} className="h-full object-cover rounded-xl" />
            )}
        </div>
    );
}