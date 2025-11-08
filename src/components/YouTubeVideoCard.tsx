import { Youtube, ExternalLink } from "lucide-react";

interface YouTubeVideo {
  title: string;
  channel: string;
  duration: string;
  views: string;
  url: string;
  thumbnail: string;
  relevance: number;
}

interface YouTubeVideoCardProps {
  video: YouTubeVideo;
}

export const YouTubeVideoCard = ({ video }: YouTubeVideoCardProps) => {
  return (
    <div className="p-4 bg-accent/5 rounded-xl border border-border hover:border-primary/50 transition-smooth group">
      <div className="flex items-start gap-3 mb-3">
        <Youtube className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold line-clamp-2 mb-1">{video.title}</p>
          <p className="text-xs text-muted-foreground">
            {video.channel} • {video.views} views • {video.duration}
          </p>
          <div className="mt-1">
            <span className="text-xs text-primary">
              {Math.round(video.relevance * 100)}% relevant
            </span>
          </div>
        </div>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-smooth"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
