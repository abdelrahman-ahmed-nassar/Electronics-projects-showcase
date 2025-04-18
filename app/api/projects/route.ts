import { NextResponse } from 'next/server';
import { uploadProject } from '@/utils/supabase/data-services';

export async function POST(request: Request) {
  try {
    const projectData = await request.json();
    console.log(projectData)
    const newProject = await uploadProject(projectData);
    
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to upload project' },
      { status: 500 }
    );
  }
}