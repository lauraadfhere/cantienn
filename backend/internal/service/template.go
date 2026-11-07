package service

import (
	"fmt"
	"html/template"
	"io"
	"path/filepath"
	"strings"
)

type TemplateService struct {
	Templates map[string]*template.Template
}

func NewTemplateService(dir string) (*TemplateService, error) {
	ts := &TemplateService{
		Templates: make(map[string]*template.Template),
	}

	layout := filepath.Join(dir, "layout.html")
	files, err := filepath.Glob(filepath.Join(dir, "*.html"))
	if err != nil {
		return nil, err
	}

	funcMap := template.FuncMap{
		"lp": func(prefix, p string) string {
			if strings.TrimSpace(p) == "" {
				p = "/"
			}
			if !strings.HasPrefix(p, "/") {
				p = "/" + p
			}
			if p == "/" {
				if strings.TrimSpace(prefix) == "" {
					return "/"
				}
				return strings.TrimRight(prefix, "/") + "/"
			}
			if strings.TrimSpace(prefix) == "" {
				return p
			}
			return strings.TrimRight(prefix, "/") + p
		},
		"tr": func(lang, key string) string {
			// This would call an i18n service in a real app
			return key 
		},
		"json": func(v interface{}) string {
			// Simplified for now
			return "{}" 
		},
	}

	for _, file := range files {
		name := filepath.Base(file)
		if name == "layout.html" {
			continue
		}

		tmpl, err := template.New(name).Funcs(funcMap).ParseFiles(layout, file)
		if err != nil {
			return nil, fmt.Errorf("error parsing template %s: %v", name, err)
		}
		ts.Templates[strings.TrimSuffix(name, ".html")] = tmpl
	}

	return ts, nil
}

func (ts *TemplateService) Render(w io.Writer, name string, data interface{}) error {
	tmpl, ok := ts.Templates[name]
	if !ok {
		return fmt.Errorf("template %s not found", name)
	}
	return tmpl.ExecuteTemplate(w, "layout.html", data)
}
