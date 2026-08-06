`<Button
  variant=\"outline\"
  size=\"sm\"
  onClick={async () => {
    try {
      const res = await fetch(
        \`\${BASE}/api/admin/applications/\${app.id}\`,
        {
          headers: authHeaders(),
        }
      );

      if (!res.ok) throw new Error(\"Failed to load application\");

      const fullApplication = await res.json();
      setSelected(fullApplication);
    } catch (err) {
      console.error(err);
      setError(\"Failed to load application details.\");
    }
  }}
>
  <Eye className=\"h-3.5 w-3.5 mr-1\" /> View
</Button>`}/>

Your **close (×) button should remain exactly as it was**:

<CodeBlock language="tsx" editable={true} content={`<button
  onClick={() => setSelected(null)}
  className=\"text-primary-foreground/70 hover:text-primary-foreground text-2xl leading-none\"
>
  ×
</button>`}/>

### What this fixes

- Dashboard list loads fast (no images in the main API call).
- Images are fetched **only when you click “View”**.
- Memory usage on Railway drops significantly.
- The selected application modal will now show the ID images again.

After pasting the new View button code:

<List gap={2}><List.Item>Save the file.</List.Item><List.Item>Redeploy to Railway.</List.Item><List.Item>Open the dashboard and click **View** on any application.</List.Item></List>

The images should appear inside the modal after a short fetch.</Response>