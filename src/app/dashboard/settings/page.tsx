import { redirect } from 'next/navigation'

export default function DashboardSettingsRedirect() {
	// Redirect dashboard sidebar settings link to the design-focused settings page
	redirect('/settings/website-info')
}


