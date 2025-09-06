import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StudentData {
  gr_number: string;
  name: string;
  email: string;
  class: string;
  semester: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Parse Excel file
    const workbook = XLSX.read(uint8Array, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    console.log('Parsed data:', jsonData);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Process and validate data
    const students: StudentData[] = [];
    const errors: string[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as any;
      
      try {
        // Expected columns: GR Number, Name, Email, Class, Semester
        const student: StudentData = {
          gr_number: String(row['GR Number'] || row['gr_number'] || '').trim(),
          name: String(row['Name'] || row['name'] || '').trim(),
          email: String(row['Email'] || row['email'] || '').trim(),
          class: String(row['Class'] || row['class'] || '').trim(),
          semester: parseInt(String(row['Semester'] || row['semester'] || '0'))
        };

        // Validate required fields
        if (!student.gr_number) {
          errors.push(`Row ${i + 2}: GR Number is required`);
          continue;
        }
        if (!student.name) {
          errors.push(`Row ${i + 2}: Name is required`);
          continue;
        }
        if (!student.email || !student.email.includes('@marwadiuniversity.ac.in')) {
          errors.push(`Row ${i + 2}: Valid Marwadi University email is required`);
          continue;
        }
        if (!student.class) {
          errors.push(`Row ${i + 2}: Class is required`);
          continue;
        }
        if (!student.semester || student.semester < 1 || student.semester > 8) {
          errors.push(`Row ${i + 2}: Valid semester (1-8) is required`);
          continue;
        }

        students.push(student);
      } catch (error) {
        errors.push(`Row ${i + 2}: Error processing row - ${error.message}`);
      }
    }

    if (students.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No valid student records found',
          details: errors
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Insert or update students in database
    const { data, error } = await supabase
      .from('students')
      .upsert(students, { 
        onConflict: 'gr_number',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Error inserting students:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save student data to database' }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully processed ${students.length} student records`,
        processed: students.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in parse-excel function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);