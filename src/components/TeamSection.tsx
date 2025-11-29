import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { EmptyState } from './EmptyState';
import { Users, Plus, Search, Mail, MapPin, Calendar } from 'lucide-react';

export function TeamSection() {
  const teamMembers = [
    { 
      name: 'Sarah Chen', 
      role: 'Manager', 
      timezone: 'PST', 
      status: 'online',
      email: 'sarah@insighthub.com',
      location: 'San Francisco, CA',
      joined: 'Jan 2024'
    },
    { 
      name: 'Mike Johnson', 
      role: 'Developer', 
      timezone: 'EST', 
      status: 'online',
      email: 'mike@insighthub.com',
      location: 'New York, NY',
      joined: 'Feb 2024'
    },
    { 
      name: 'Emma Wilson', 
      role: 'Developer', 
      timezone: 'GMT', 
      status: 'away',
      email: 'emma@insighthub.com',
      location: 'London, UK',
      joined: 'Dec 2023'
    },
    { 
      name: 'Alex Kim', 
      role: 'Developer', 
      timezone: 'JST', 
      status: 'offline',
      email: 'alex@insighthub.com',
      location: 'Tokyo, Japan',
      joined: 'Mar 2024'
    },
    { 
      name: 'Jordan Taylor', 
      role: 'Developer', 
      timezone: 'CET', 
      status: 'online',
      email: 'jordan@insighthub.com',
      location: 'Berlin, Germany',
      joined: 'Jan 2024'
    },
    { 
      name: 'Chris Martinez', 
      role: 'Manager', 
      timezone: 'PST', 
      status: 'online',
      email: 'chris@insighthub.com',
      location: 'Seattle, WA',
      joined: 'Nov 2023'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Team</h1>
          <p className="text-muted-foreground">
            Manage your team members and their roles
          </p>
        </div>
        <Button className="gap-2 rounded-xl bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search team members..." 
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="p-6 rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                <span className="text-xl">{member.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <Badge 
                variant="outline" 
                className={`
                  rounded-lg
                  ${member.status === 'online' ? 'border-success text-success' : ''}
                  ${member.status === 'away' ? 'border-warning text-warning' : ''}
                  ${member.status === 'offline' ? 'border-border text-muted-foreground' : ''}
                `}
              >
                {member.status}
              </Badge>
            </div>

            <h3 className="mb-1">{member.name}</h3>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="rounded-lg">
                {member.role}
              </Badge>
              <Badge variant="secondary" className="rounded-lg">
                {member.timezone}
              </Badge>
            </div>

            <div className="space-y-2 text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{member.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Joined {member.joined}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full rounded-xl">
              View Profile
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
